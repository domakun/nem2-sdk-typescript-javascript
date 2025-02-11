/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { KeyPair, SHA3Hasher, SignSchema } from '../../core/crypto';
import { Convert } from '../../core/format';
import { SerializeTransactionToJSON } from '../../infrastructure/transaction/SerializeTransactionToJSON';
import { Account } from '../account/Account';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { SignedTransaction } from './SignedTransaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';

/**
 * An abstract transaction class that serves as the base class of all NEM transactions.
 */
export abstract class Transaction {

    /**
     * Transaction header size
     *
     * Included fields are `size`, `verifiableEntityHeader_Reserved1`,
     * `signature`, `signerPublicKey` and `entityBody_Reserved1`.
     *
     * @var {number}
     */
    public static readonly Header_Size: number = 8 + 64 + 32 + 4;

    /**
     * Index of the transaction *type*
     *
     * Included fields are the transaction header, `version`
     * and `network`
     *
     * @var {number}
     */
    public static readonly Type_Index: number = Transaction.Header_Size + 2;

    /**
     * Index of the transaction *body*
     *
     * Included fields are the transaction header, `version`,
     * `network`, `type`, `maxFee` and `deadline`
     *
     * @var {number}
     */
    public static readonly Body_Index: number = Transaction.Header_Size + 1 + 1 + 2 + 8 + 8;

    /**
     * @constructor
     * @param type
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(/**
                 * The transaction type.
                 */
                public readonly type: number,
                /**
                 * The network type.
                 */
                public readonly networkType: NetworkType,
                /**
                 * The transaction version number.
                 */
                public readonly version: number,
                /**
                 * The deadline to include the transaction.
                 */
                public readonly deadline: Deadline,
                /**
                 * A sender of a transaction must specify during the transaction definition a max_fee,
                 * meaning the maximum fee the account allows to spend for this transaction.
                 */
                public readonly maxFee: UInt64,
                /**
                 * The transaction signature (missing if part of an aggregate transaction).
                 */
                public readonly signature?: string,
                /**
                 * The account of the transaction creator.
                 */
                public readonly signer?: PublicAccount,
                /**
                 * Transactions meta data object contains additional information about the transaction.
                 */
                public readonly transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
    }

    /**
     * Generate transaction hash hex
     *
     * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/EntityHasher.cpp#L32
     * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/EntityHasher.cpp#L35
     * @see https://github.com/nemtech/catapult-server/blob/master/sdk/src/extensions/TransactionExtensions.cpp#L46
     * @param {string} transactionPayload HexString Payload
     * @param {Array<number>} generationHashBuffer Network generation hash byte
     * @param {NetworkType} networkType Catapult network identifier
     * @returns {string} Returns Transaction Payload hash
     */
    public static createTransactionHash(transactionPayload: string, generationHashBuffer: number[], networkType: NetworkType): string {

        // prepare
        const entityHash: Uint8Array = new Uint8Array(32);
        const transactionBytes: Uint8Array = Convert.hexToUint8(transactionPayload);

        // read transaction type
        const typeIdx: number = Transaction.Type_Index;
        const typeBytes: Uint8Array = transactionBytes.slice(typeIdx, typeIdx + 2).reverse(); // REVERSED
        const entityType: TransactionType = parseInt(Convert.uint8ToHex(typeBytes), 16);
        const isAggregateTransaction = [
            TransactionType.AGGREGATE_BONDED,
            TransactionType.AGGREGATE_COMPLETE,
        ].find((type: TransactionType) => entityType === type) !== undefined;

        // 1) take "R" part of a signature (first 32 bytes)
        const signatureR: Uint8Array = transactionBytes.slice(8, 8 + 32);

        // 2) add public key to match sign/verify behavior (32 bytes)
        const pubKeyIdx: number = signatureR.length;
        const publicKey: Uint8Array = transactionBytes.slice(8 + 64, 8 + 64 + 32);

        // 3) add generationHash (32 bytes)
        const generationHashIdx: number = pubKeyIdx + publicKey.length;
        const generationHash: Uint8Array = Uint8Array.from(generationHashBuffer);

        // 4) add transaction data without header (EntityDataBuffer)
        // @link https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/EntityHasher.cpp#L30
        const transactionBodyIdx: number = generationHashIdx + generationHash.length;
        let transactionBody: Uint8Array = transactionBytes.slice(Transaction.Header_Size);

        // in case of aggregate transactions, we hash only the merkle transaction hash.
        if (isAggregateTransaction) {
            transactionBody = transactionBytes.slice(Transaction.Header_Size, Transaction.Body_Index + 32);
        }

        // 5) concatenate binary hash parts
        // layout: `signature_R || signerPublicKey || generationHash || EntityDataBuffer`
        const entityHashBytes: Uint8Array = new Uint8Array(
            signatureR.length
          + publicKey.length
          + generationHash.length
          + transactionBody.length,
        );
        entityHashBytes.set(signatureR, 0);
        entityHashBytes.set(publicKey, pubKeyIdx);
        entityHashBytes.set(generationHash, generationHashIdx);
        entityHashBytes.set(transactionBody, transactionBodyIdx);

        // 6) create SHA3 hash of transaction data
        // Note: Transaction hashing *always* uses SHA3
        SHA3Hasher.func(entityHash, entityHashBytes, 32, SignSchema.SHA3);
        return Convert.uint8ToHex(entityHash);
    }

    /**
     * @internal
     */
    protected abstract generateBytes(): Uint8Array;

    /**
     * @internal
     */
    protected abstract generateEmbeddedBytes(): Uint8Array;

    /**
     * @internal
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account - The account to sign the transaction
     * @param generationHash - Network generation hash hex
     * @returns {SignedTransaction}
     */
    public signWith(account: Account, generationHash: string): SignedTransaction {
        const generationHashBytes = Array.from(Convert.hexToUint8(generationHash));
        const signSchema = SHA3Hasher.resolveSignSchema(account.networkType);
        const byteBuffer = Array.from(this.generateBytes());
        const signingBytes = this.getSigningBytes(byteBuffer, generationHashBytes);
        const keyPairEncoded = KeyPair.createKeyPairFromPrivateKeyString(account.privateKey, signSchema);
        const signature = Array.from(KeyPair.sign(account, new Uint8Array(signingBytes), signSchema));
        const signedTransactionBuffer = byteBuffer
            .splice(0, 8)
            .concat(signature)
            .concat(Array.from(keyPairEncoded.publicKey))
            .concat(Array.from(new Uint8Array(4)))
            .concat(byteBuffer
                .splice(64 + 32 + 4, byteBuffer.length));
        const payload = Convert.uint8ToHex(signedTransactionBuffer);
        return new SignedTransaction(
            payload,
            Transaction.createTransactionHash(payload, generationHashBytes, account.networkType),
            account.publicKey,
            this.type,
            this.networkType);
    }

    /**
     * @internal
     * Generate signing bytes
     * @param payloadBytes Payload buffer
     * @param generationHashBytes GenerationHash buffer
     */
    protected getSigningBytes(payloadBytes: number[], generationHashBytes: number[]) {
        const byteBufferWithoutHeader = payloadBytes.slice(4 + 64 + 32 + 8);
        if (this.type === TransactionType.AGGREGATE_BONDED || this.type === TransactionType.AGGREGATE_COMPLETE) {
            return generationHashBytes.concat(byteBufferWithoutHeader.slice(0, 52));
        } else {
            return generationHashBytes.concat(byteBufferWithoutHeader);
        }
    }

    /**
     * Converts the transaction into AggregateTransaction compatible
     * @returns {Array.<*>} AggregateTransaction bytes
     */
    public aggregateTransaction(): number[] {
        const signerPublicKey = Convert.hexToUint8(this.signer!.publicKey);
        let resultBytes = Array.from(this.generateBytes());
        resultBytes.splice(0, 4 + 64 + 32);
        resultBytes = Array.from(signerPublicKey).concat(resultBytes);
        resultBytes.splice(32 + 2 + 2, 16);
        return Array.from((new Uint8Array([
            (resultBytes.length + 4 & 0x000000ff),
            (resultBytes.length + 4 & 0x0000ff00) >> 8,
            (resultBytes.length + 4 & 0x00ff0000) >> 16,
            (resultBytes.length + 4 & 0xff000000) >> 24,
        ]))).concat(resultBytes);
    }

    /**
     * Convert an aggregate transaction to an inner transaction including transaction signer.
     * Signer is optional for `AggregateComplete` transaction `ONLY`.
     * If no signer provided, aggregate transaction signer will be delegated on signing
     * @param signer - Innre transaction signer.
     * @returns InnerTransaction
     */
    public toAggregate(signer: PublicAccount): InnerTransaction {
        if (this.type === TransactionType.AGGREGATE_BONDED || this.type === TransactionType.AGGREGATE_COMPLETE) {
            throw new Error('Inner transaction cannot be an aggregated transaction.');
        }
        return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {signer});
    }

    /**
     * Takes a transaction and formats bytes to be included in an aggregate transaction.
     *
     * @return transaction with signer serialized to be part of an aggregate transaction
     */
    public toAggregateTransactionBytes() {
        return this.generateEmbeddedBytes();
    }

    /**
     * Transaction pending to be included in a block
     * @returns {boolean}
     */
    public isUnconfirmed(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0
            && this.transactionInfo.hash === this.transactionInfo.merkleComponentHash;
    }

    /**
     * Transaction included in a block
     * @returns {boolean}
     */
    public isConfirmed(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() > 0;
    }

    /**
     * Returns if a transaction has missing signatures.
     * @returns {boolean}
     */
    public hasMissingSignatures(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0 &&
            this.transactionInfo.hash !== this.transactionInfo.merkleComponentHash;
    }

    /**
     * Transaction is not known by the network
     * @return {boolean}
     */
    public isUnannounced(): boolean {
        return this.transactionInfo == null;
    }

    /**
     * @internal
     */
    public versionToDTO(): number {
        return (this.networkType << 8) + this.version;
    }

    /**
     * @internal
     */
    public versionToHex(): string {
        return '0x' + this.versionToDTO().toString(16);
    }

    /**
     * @description reapply a given value to the transaction in an immutable way
     * @param {Deadline} deadline
     * @returns {Transaction}
     * @memberof Transaction
     */
    public reapplyGiven(deadline: Deadline = Deadline.create()): Transaction {
        if (this.isUnannounced()) {
            return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {deadline});
        }
        throw new Error('an Announced transaction can\'t be modified');
    }

    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public get size(): number {
        const byteSize = 4 // size
                        + 4 // verifiableEntityHeader_Reserved1
                        + 64 // signature
                        + 32 // signerPublicKey
                        + 4 // entityBody_Reserved1
                        + 1 // version
                        + 1 // networkType
                        + 2 // type
                        + 8 // maxFee
                        + 8; // deadline

        return byteSize;
    }

    /**
     * @description Serialize a transaction object
     * @returns {string}
     * @memberof Transaction
     */
    public serialize(): string {
        return Convert.uint8ToHex(this.generateBytes());
    }

    /**
     * @description Create JSON object
     * @returns {Object}
     * @memberof Transaction
     */
    public toJSON() {
        const commonTransactionObject = {
            type: this.type,
            network: this.networkType,
            version: this.versionToDTO(),
            maxFee: this.maxFee.toString(),
            deadline: this.deadline.toString(),
            signature: this.signature ? this.signature : '',
        };

        if (this.signer) {
            Object.assign(commonTransactionObject, {signerPublicKey: this.signer.publicKey});
        }

        const childClassObject = SerializeTransactionToJSON(this);
        return {transaction: Object.assign(commonTransactionObject, childClassObject)};
    }
}

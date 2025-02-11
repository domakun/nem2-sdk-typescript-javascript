/*
 * Copyright 2019 NEM
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

import { Convert, RawAddress } from '../../core/format';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { AccountAddressRestrictionTransactionBuilder } from '../../infrastructure/catbuffer/AccountAddressRestrictionTransactionBuilder';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import {
    EmbeddedAccountAddressRestrictionTransactionBuilder,
} from '../../infrastructure/catbuffer/EmbeddedAccountAddressRestrictionTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { UnresolvedAddressDto } from '../../infrastructure/catbuffer/UnresolvedAddressDto';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
import { AccountRestrictionFlags } from '../restriction/AccountRestrictionType';
import { UInt64 } from '../UInt64';
import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class AccountAddressRestrictionTransaction extends Transaction {

    /**
     * Create a modify account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionFlags - The account restriction flags.
     * @param restrictionAdditions - Account restriction additions.
     * @param restrictionDeletions - Account restriction deletions.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         restrictionFlags: AccountRestrictionFlags,
                         restrictionAdditions: Array<Address | NamespaceId>,
                         restrictionDeletions: Array<Address | NamespaceId>,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): AccountAddressRestrictionTransaction {
        return new AccountAddressRestrictionTransaction(networkType,
            TransactionVersion.ACCOUNT_RESTRICTION_ADDRESS,
            deadline,
            maxFee,
            restrictionFlags,
            restrictionAdditions,
            restrictionDeletions);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param restrictionFlags
     * @param restrictionAdditions
     * @param restrictionDeletions
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly restrictionFlags: AccountRestrictionFlags,
                public readonly restrictionAdditions: Array<Address | NamespaceId>,
                public readonly restrictionDeletions: Array<Address | NamespaceId>,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.ACCOUNT_RESTRICTION_ADDRESS,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedAccountAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
                        AccountAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = AccountAddressRestrictionTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as AccountAddressRestrictionTransactionBuilder).getDeadline().timestamp),
            builder.getRestrictionFlags().valueOf(),
            builder.getRestrictionAdditions().map((addition) => {
                return UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(addition.unresolvedAddress));
            }),
            builder.getRestrictionDeletions().map((deletion) => {
                return UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(deletion.unresolvedAddress));
            }),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as AccountAddressRestrictionTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountAddressRestrictionTransaction
     * @returns {number}
     * @memberof AccountAddressRestrictionTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteRestrictionType = 2;
        const byteAdditionCount = 1;
        const byteDeletionCount = 1;
        const byteAccountRestrictionTransactionBody_Reserved1 = 4;
        const byteRestrictionAdditions = 25 * this.restrictionAdditions.length;
        const byteRestrictionDeletions = 25 * this.restrictionDeletions.length;

        return byteSize + byteRestrictionType + byteAdditionCount + byteDeletionCount +
               byteRestrictionAdditions + byteRestrictionDeletions +
               byteAccountRestrictionTransactionBody_Reserved1;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new AccountAddressRestrictionTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_RESTRICTION_ADDRESS.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.restrictionFlags.valueOf(),
            this.restrictionAdditions.map((addition) => {
                return new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(addition, this.networkType));
            }),
            this.restrictionDeletions.map((deletion) => {
                return new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(deletion, this.networkType));
            }),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedAccountAddressRestrictionTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_RESTRICTION_ADDRESS.valueOf(),
            this.restrictionFlags.valueOf(),
            this.restrictionAdditions.map((addition) => {
                return new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(addition, this.networkType));
            }),
            this.restrictionDeletions.map((deletion) => {
                return new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(deletion, this.networkType));
            }),
        );
        return transactionBuilder.serialize();
    }
}

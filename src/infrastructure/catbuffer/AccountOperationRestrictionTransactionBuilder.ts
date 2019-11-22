// tslint:disable: jsdoc-format
/**
*** Copyright (c) 2016-present,
*** Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
***
*** This file is part of Catapult.
***
*** Catapult is free software: you can redistribute it and/or modify
*** it under the terms of the GNU Lesser General Public License as published by
*** the Free Software Foundation, either version 3 of the License, or
*** (at your option) any later version.
***
*** Catapult is distributed in the hope that it will be useful,
*** but WITHOUT ANY WARRANTY; without even the implied warranty of
*** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*** GNU Lesser General Public License for more details.
***
*** You should have received a copy of the GNU Lesser General Public License
*** along with Catapult. If not, see <http://www.gnu.org/licenses/>.
**/

import { AccountOperationRestrictionTransactionBodyBuilder } from './AccountOperationRestrictionTransactionBodyBuilder';
import { AmountDto } from './AmountDto';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { NetworkTypeDto } from './NetworkTypeDto';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';

/** Binary layout for a non-embedded account operation restriction transaction. */
export class AccountOperationRestrictionTransactionBuilder extends TransactionBuilder {
    /** Account operation restriction transaction body. */
    accountOperationRestrictionTransactionBody: AccountOperationRestrictionTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signature Entity signature.
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param fee Transaction fee.
     * @param deadline Transaction deadline.
     * @param restrictionFlags Account restriction flags.
     * @param restrictionAdditions Account restriction additions.
     * @param restrictionDeletions Account restriction deletions.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto,  restrictionFlags: number,  restrictionAdditions: number[],  restrictionDeletions: number[]) {
        super(signature, signerPublicKey, version, network, type, fee, deadline);
        // tslint:disable-next-line: max-line-length
        this.accountOperationRestrictionTransactionBody = new AccountOperationRestrictionTransactionBodyBuilder(restrictionFlags, restrictionAdditions, restrictionDeletions);
    }

    /**
     * Creates an instance of AccountOperationRestrictionTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AccountOperationRestrictionTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AccountOperationRestrictionTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const accountOperationRestrictionTransactionBody = AccountOperationRestrictionTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, accountOperationRestrictionTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new AccountOperationRestrictionTransactionBuilder(superObject.signature, superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, superObject.fee, superObject.deadline, accountOperationRestrictionTransactionBody.restrictionFlags, accountOperationRestrictionTransactionBody.restrictionAdditions, accountOperationRestrictionTransactionBody.restrictionDeletions);
    }

    /**
     * Gets account restriction flags.
     *
     * @return Account restriction flags.
     */
    public getRestrictionFlags(): number {
        return this.accountOperationRestrictionTransactionBody.getRestrictionFlags();
    }

    /**
     * Gets reserved padding to align restrictionAdditions on 8-byte boundary.
     *
     * @return Reserved padding to align restrictionAdditions on 8-byte boundary.
     */
    public getAccountRestrictionTransactionBody_Reserved1(): number {
        return this.accountOperationRestrictionTransactionBody.getAccountRestrictionTransactionBody_Reserved1();
    }

    /**
     * Gets account restriction additions.
     *
     * @return Account restriction additions.
     */
    public getRestrictionAdditions(): number[] {
        return this.accountOperationRestrictionTransactionBody.getRestrictionAdditions();
    }

    /**
     * Gets account restriction deletions.
     *
     * @return Account restriction deletions.
     */
    public getRestrictionDeletions(): number[] {
        return this.accountOperationRestrictionTransactionBody.getRestrictionDeletions();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.accountOperationRestrictionTransactionBody.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const superBytes = super.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, superBytes);
        const accountOperationRestrictionTransactionBodyBytes = this.accountOperationRestrictionTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, accountOperationRestrictionTransactionBodyBytes);
        return newArray;
    }
}

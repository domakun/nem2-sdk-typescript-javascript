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

import { AliasActionDto } from './AliasActionDto';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { MosaicAliasTransactionBodyBuilder } from './MosaicAliasTransactionBodyBuilder';
import { MosaicIdDto } from './MosaicIdDto';
import { NamespaceIdDto } from './NamespaceIdDto';
import { NetworkTypeDto } from './NetworkTypeDto';

/** Binary layout for an embedded mosaic alias transaction. */
export class EmbeddedMosaicAliasTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Mosaic alias transaction body. */
    mosaicAliasTransactionBody: MosaicAliasTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param namespaceId Identifier of the namespace that will become an alias.
     * @param mosaicId Aliased mosaic identifier.
     * @param aliasAction Alias action.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  namespaceId: NamespaceIdDto,  mosaicId: MosaicIdDto,  aliasAction: AliasActionDto) {
        super(signerPublicKey, version, network, type);
        this.mosaicAliasTransactionBody = new MosaicAliasTransactionBodyBuilder(namespaceId, mosaicId, aliasAction);
    }

    /**
     * Creates an instance of EmbeddedMosaicAliasTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedMosaicAliasTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedMosaicAliasTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const mosaicAliasTransactionBody = MosaicAliasTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicAliasTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedMosaicAliasTransactionBuilder(superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, mosaicAliasTransactionBody.namespaceId, mosaicAliasTransactionBody.mosaicId, mosaicAliasTransactionBody.aliasAction);
    }

    /**
     * Gets identifier of the namespace that will become an alias.
     *
     * @return Identifier of the namespace that will become an alias.
     */
    public getNamespaceId(): NamespaceIdDto {
        return this.mosaicAliasTransactionBody.getNamespaceId();
    }

    /**
     * Gets aliased mosaic identifier.
     *
     * @return Aliased mosaic identifier.
     */
    public getMosaicId(): MosaicIdDto {
        return this.mosaicAliasTransactionBody.getMosaicId();
    }

    /**
     * Gets alias action.
     *
     * @return Alias action.
     */
    public getAliasAction(): AliasActionDto {
        return this.mosaicAliasTransactionBody.getAliasAction();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.mosaicAliasTransactionBody.getSize();
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
        const mosaicAliasTransactionBodyBytes = this.mosaicAliasTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicAliasTransactionBodyBytes);
        return newArray;
    }
}

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
/**
 * Catapult REST Endpoints
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.21
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { AccountMetadataTransactionBodyDTO } from './accountMetadataTransactionBodyDTO';
import { NetworkTypeEnum } from './networkTypeEnum';
import { TransactionDTO } from './transactionDTO';

/**
* Transaction to create or modify a multisig account.
*/
export class AccountMetadataTransactionDTO {
    /**
    * Entity\'s signature generated by the signer.
    */
    'signature': string;
    'signerPublicKey': string;
    /**
    * Entity version.
    */
    'version': number;
    'network': NetworkTypeEnum;
    'type': number;
    /**
    * Absolute amount. An amount of 123456789 (absolute) for a mosaic with divisibility 6 means 123.456789 (relative).
    */
    'maxFee': string;
    /**
    * Duration expressed in number of blocks.
    */
    'deadline': string;
    'targetPublicKey': string;
    /**
    * Metadata key scoped to source, target and type.
    */
    'scopedMetadataKey': string;
    /**
    * Change in value size in bytes.
    */
    'valueSizeDelta': number;
    /**
    * Value size in bytes.
    */
    'valueSize': number;
    /**
    * When there is an existing value, the new value is calculated as xor(previous-value, value).
    */
    'value': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "signature",
            "baseName": "signature",
            "type": "string"
        },
        {
            "name": "signerPublicKey",
            "baseName": "signerPublicKey",
            "type": "string"
        },
        {
            "name": "version",
            "baseName": "version",
            "type": "number"
        },
        {
            "name": "network",
            "baseName": "network",
            "type": "NetworkTypeEnum"
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "number"
        },
        {
            "name": "maxFee",
            "baseName": "maxFee",
            "type": "string"
        },
        {
            "name": "deadline",
            "baseName": "deadline",
            "type": "string"
        },
        {
            "name": "targetPublicKey",
            "baseName": "targetPublicKey",
            "type": "string"
        },
        {
            "name": "scopedMetadataKey",
            "baseName": "scopedMetadataKey",
            "type": "string"
        },
        {
            "name": "valueSizeDelta",
            "baseName": "valueSizeDelta",
            "type": "number"
        },
        {
            "name": "valueSize",
            "baseName": "valueSize",
            "type": "number"
        },
        {
            "name": "value",
            "baseName": "value",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return AccountMetadataTransactionDTO.attributeTypeMap;
    }
}


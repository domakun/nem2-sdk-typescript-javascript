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

import {expect} from 'chai';
import {of as observableOf} from 'rxjs';
import {deepEqual, instance, mock, when} from 'ts-mockito';
import { Convert } from '../../src/core/format/Convert';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { Account } from '../../src/model/account/Account';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { Metadata } from '../../src/model/metadata/Metadata';
import { MetadataEntry } from '../../src/model/metadata/MetadataEntry';
import { MetadataType } from '../../src/model/metadata/MetadataType';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import {NamespaceId} from '../../src/model/namespace/NamespaceId';
import { AccountMetadataTransaction } from '../../src/model/transaction/AccountMetadataTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../src/model/transaction/NamespaceMetadataTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import {UInt64} from '../../src/model/UInt64';
import { MetadataTransactionService } from '../../src/service/MetadataTransactionService';
import { TestingAccount } from '../conf/conf.spec';

describe('MetadataTransactionService', () => {
    let account: Account;
    let metadataTransactionService: MetadataTransactionService;
    const key = UInt64.fromHex('85BBEA6CC462B244');
    const value = 'TEST';
    const deltaValue = 'dalta';
    const targetIdHex = '941299B2B7E1291C';

    before(() => {
        account = TestingAccount;
        const mockMetadataHttp = mock(MetadataHttp);

        when(mockMetadataHttp
            .getAccountMetadataByKeyAndSender(deepEqual(account.address), key.toHex(), account.publicKey))
            .thenReturn(observableOf(mockMetadata(MetadataType.Account)));
        when(mockMetadataHttp
            .getMosaicMetadataByKeyAndSender(deepEqual(new MosaicId(targetIdHex)), key.toHex(), account.publicKey))
                .thenReturn(observableOf(mockMetadata(MetadataType.Mosaic)));
        when(mockMetadataHttp
            .getNamespaceMetadataByKeyAndSender(deepEqual(NamespaceId.createFromEncoded(targetIdHex)), key.toHex(), account.publicKey))
            .thenReturn(observableOf(mockMetadata(MetadataType.Namespace)));
        const metadataHttp = instance(mockMetadataHttp);
        metadataTransactionService = new MetadataTransactionService(metadataHttp);
    });

    it('should create AccountMetadataTransaction', (done) => {
        metadataTransactionService.createMetadataTransaction(Deadline.create(),
                                                             NetworkType.MIJIN_TEST,
                                                             MetadataType.Account,
                                                             account.publicAccount,
                                                             key,
                                                             value + deltaValue,
                                                             account.publicAccount)
            .subscribe((transaction: AccountMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA_TRANSACTION);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                expect(Convert.utf8ToHex(transaction.value))
                    .to.be.equal(Convert.xor(Convert.utf8ToUint8(value), Convert.utf8ToUint8(value + deltaValue)));
                expect(transaction.valueSizeDelta).to.be.equal(deltaValue.length);
                expect(transaction.targetPublicKey).to.be.equal(account.publicKey);
                done();
        });
    });

    it('should create MosaicMetadataTransaction', (done) => {
        metadataTransactionService.createMetadataTransaction(Deadline.create(),
                                                             NetworkType.MIJIN_TEST,
                                                             MetadataType.Mosaic,
                                                             account.publicAccount,
                                                             key,
                                                             value + deltaValue,
                                                             account.publicAccount,
                                                             new MosaicId(targetIdHex))
            .subscribe((transaction: MosaicMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA_TRANSACTION);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                expect(Convert.utf8ToHex(transaction.value))
                    .to.be.equal(Convert.xor(Convert.utf8ToUint8(value), Convert.utf8ToUint8(value + deltaValue)));
                expect(transaction.targetMosaicId.toHex()).to.be.equal(targetIdHex);
                expect(transaction.valueSizeDelta).to.be.equal(deltaValue.length);
                expect(transaction.targetPublicKey).to.be.equal(account.publicKey);
                done();
        });
    });

    it('should create NamespaceMetadataTransaction', (done) => {
        metadataTransactionService.createMetadataTransaction(Deadline.create(),
                                                             NetworkType.MIJIN_TEST,
                                                             MetadataType.Namespace,
                                                             account.publicAccount,
                                                             key,
                                                             value + deltaValue,
                                                             account.publicAccount,
                                                             NamespaceId.createFromEncoded(targetIdHex))
            .subscribe((transaction: NamespaceMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA_TRANSACTION);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                expect(Convert.utf8ToHex(transaction.value))
                    .to.be.equal(Convert.xor(Convert.utf8ToUint8(value), Convert.utf8ToUint8(value + deltaValue)));
                expect(transaction.targetNamespaceId.toHex()).to.be.equal(targetIdHex);
                expect(transaction.valueSizeDelta).to.be.equal(deltaValue.length);
                expect(transaction.targetPublicKey).to.be.equal(account.publicKey);
                done();
        });
    });

    it('should throw error with invalid metadata type', () => {
        expect(() => {
            metadataTransactionService.createMetadataTransaction(Deadline.create(),
                                                                NetworkType.MIJIN_TEST,
                                                                99,
                                                                account.publicAccount,
                                                                key,
                                                                value + deltaValue,
                                                                account.publicAccount);
        }).to.throw(Error, 'Metadata type invalid');
    });

    it('should throw error with invalid mosaicId', () => {
        expect(() => {
            metadataTransactionService.createMetadataTransaction(Deadline.create(),
                                                                NetworkType.MIJIN_TEST,
                                                                MetadataType.Mosaic,
                                                                account.publicAccount,
                                                                key,
                                                                value + deltaValue,
                                                                account.publicAccount);
        }).to.throw(Error, 'TargetId for MosaicMetadataTransaction is invalid');
    });

    it('should throw error with invalid NamespaceId', () => {
        expect(() => {
            metadataTransactionService.createMetadataTransaction(Deadline.create(),
                                                                NetworkType.MIJIN_TEST,
                                                                MetadataType.Namespace,
                                                                account.publicAccount,
                                                                key,
                                                                value + deltaValue,
                                                                account.publicAccount);
        }).to.throw(Error, 'TargetId for NamespaceMetadataTransaction is invalid');
    });

    function mockMetadata(type: MetadataType): Metadata {
        let targetId;

        if (type === MetadataType.Account) {
            targetId = undefined;
        } else  if (type === MetadataType.Mosaic) {
            targetId = new MosaicId(targetIdHex);
        } else if (type === MetadataType.Namespace) {
            targetId = NamespaceId.createFromEncoded(targetIdHex);
        }
        return new Metadata(
            '59DFBA84B2E9E7000135E80C',
            new MetadataEntry(
                '5E628EA59818D97AA4118780D9A88C5512FCE7A21C195E1574727EFCE5DF7C0D',
                account.publicKey,
                account.publicKey,
                key,
                MetadataType.Account,
                value,
                targetId),
            );
    }
});

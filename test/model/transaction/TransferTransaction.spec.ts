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

import { expect } from 'chai';
import {Convert} from '../../../src/core/format';
import { CreateTransactionFromPayload } from '../../../src/infrastructure/transaction/CreateTransactionFromPayload';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { MessageType } from '../../../src/model/message/MessageType';
import { PersistentHarvestingDelegationMessage } from '../../../src/model/message/PersistentHarvestingDelegationMessage';
import { PlainMessage } from '../../../src/model/message/PlainMessage';
import { Mosaic } from '../../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NetworkCurrencyMosaic } from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('TransferTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const delegatedPrivateKey = '8A78C9E9B0E59D0F74C0D47AB29FBD523C706293A3FA9CD9FE0EEB2C10EA924A';
    const recipientPublicKey = '9DBF67474D6E1F8B131B4EB1F5BA0595AFFAE1123607BC1048F342193D7E669F';
    const messageMarker = 'FECC71C764BFE598';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.maxFee.higher).to.be.equal(0);
        expect(transferTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(transferTransaction.maxFee.higher).to.be.equal(0);
        expect(transferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an TransferTransaction object and sign it without mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(0);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142000D000000000000746573742D6D657373616765');
    });

    it('should createComplete an TransferTransaction object and sign it with mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal(
            '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142010D000000000044B262C46CEABB8500E1F' +
            '5050000000000746573742D6D657373616765');
    });

    it('should createComplete an TransferTransaction object with NamespaceId recipientAddress', () => {
        const addressAlias = new NamespaceId('nem.owner');
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            addressAlias,
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipientAddress).to.be.instanceof(NamespaceId);
        expect(transferTransaction.recipientAddress).to.be.equal(addressAlias);
        expect((transferTransaction.recipientAddress as NamespaceId).toHex()).to.be.equal(addressAlias.toHex());

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('9151776168D24257D800000000000000000000000000000000010D000000000044B262C46CEABB8500E1F' +
            '5050000000000746573742D6D657373616765');
    });

    it('should format TransferTransaction payload with 25 bytes binary address', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        // test recipientToString with Address recipient
        expect(transferTransaction.recipientToString()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            306,
        )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
    });

    it('should format TransferTransaction payload with 8 bytes binary namespaceId', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            new NamespaceId('nem.owner'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        // test recipientToString with NamespaceId recipient
        expect(transferTransaction.recipientToString()).to.be.equal('D85742D268617751');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            306,
        )).to.be.equal('9151776168D24257D800000000000000000000000000000000');
    });

    describe('size', () => {
        it('should return 180 for TransferTransaction with 1 mosaic and message NEM', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
                [
                    NetworkCurrencyMosaic.createRelative(100),
                ],
                PlainMessage.create('NEM'),
                NetworkType.MIJIN_TEST,
            );
            expect(Convert.hexToUint8(transaction.serialize()).length).to.be.equal(transaction.size);
            expect(transaction.size).to.be.equal(180);
        });
    });

    it('should create TransferTransaction and sign using catbuffer', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal(
            '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142010D000000000044B262C46CEABB8500E1F' +
            '5050000000000746573742D6D657373616765');
    });

    it('should create Transafer transaction for persistent harvesting delegation request transaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PersistentHarvestingDelegationMessage
                .create(delegatedPrivateKey, account.privateKey, recipientPublicKey, NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.type).to.be.equal(MessageType.PersistentHarvestingDelegationMessage);
    });

    it('should createComplete an persistentDelegationRequestTransaction object and sign it', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PersistentHarvestingDelegationMessage
                .create(delegatedPrivateKey, account.privateKey, recipientPublicKey, NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload.length).to.be.equal(192 + messageMarker.length);
        expect(transferTransaction.message.payload.includes(messageMarker)).to.be.true;
        expect(transferTransaction.mosaics.length).to.be.equal(0);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain())
            .to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        ).includes(transferTransaction.message.payload)).to.be.true;
    });

    it('should throw exception with mosaic provided when creating persistentDelegationRequestTransaction', () => {
        expect(() => {
            TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
                [NetworkCurrencyMosaic.createRelative(100)],
                PersistentHarvestingDelegationMessage
                    .create(delegatedPrivateKey, account.privateKey, recipientPublicKey,  NetworkType.MIJIN_TEST),
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error, 'PersistentDelegationRequestTransaction should be created without Mosaic');
    });

    it('should throw exception with invalid message when creating persistentDelegationRequestTransaction', () => {
        expect(() => {
            TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
                [NetworkCurrencyMosaic.createRelative(100)],
                PersistentHarvestingDelegationMessage.create('abc',  account.privateKey, recipientPublicKey, NetworkType.MIJIN_TEST),
                NetworkType.MIJIN_TEST,
            );
        }).to.throw();
    });

    it('should throw exception with invalid private key when creating persistentDelegationRequestTransaction', () => {
        expect(() => {
            TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
                [NetworkCurrencyMosaic.createRelative(100)],
                PersistentHarvestingDelegationMessage.create(delegatedPrivateKey, 'abc', recipientPublicKey, NetworkType.MIJIN_TEST),
                NetworkType.MIJIN_TEST,
            );
        }).to.throw();
    });

    it('should sort the Mosaic array', () => {
        const mosaics = [
            new Mosaic(new MosaicId(UInt64.fromUint(200).toDTO()), UInt64.fromUint(0)),
            new Mosaic(new MosaicId(UInt64.fromUint(100).toDTO()), UInt64.fromUint(0)),
        ];

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            mosaics,
            PlainMessage.create('NEM'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.mosaics[0].id.id.compact()).to.be.equal(200);
        expect(transferTransaction.mosaics[1].id.id.compact()).to.be.equal(100);

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            320,
            384,
        )).to.be.equal(
            '64000000000000000000000000000000C8000000000000000000000000000000');

        const sorted = CreateTransactionFromPayload(signedTransaction.payload) as TransferTransaction;
        expect(sorted.mosaics[0].id.id.compact()).to.be.equal(100);
        expect(sorted.mosaics[1].id.id.compact()).to.be.equal(200);
    });

    it('should sort the Mosaic array - using Hex MosaicId', () => {
        const mosaics = [
            new Mosaic(new MosaicId('D525AD41D95FCF29'), UInt64.fromUint(5)),
            new Mosaic(new MosaicId('77A1969932D987D7'), UInt64.fromUint(6)),
            new Mosaic(new MosaicId('67F2B76F28BD36BA'), UInt64.fromUint(10)),
        ];

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            mosaics,
            PlainMessage.create('NEM'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.mosaics[0].id.toHex()).to.be.equal('D525AD41D95FCF29');
        expect(transferTransaction.mosaics[1].id.toHex()).to.be.equal('77A1969932D987D7');
        expect(transferTransaction.mosaics[2].id.toHex()).to.be.equal('67F2B76F28BD36BA');

        const signedTransaction = transferTransaction.signWith(account, generationHash);
        const sorted = CreateTransactionFromPayload(signedTransaction.payload) as TransferTransaction;
        expect(sorted.mosaics[0].id.toHex()).to.be.equal('67F2B76F28BD36BA');
        expect(sorted.mosaics[1].id.toHex()).to.be.equal('77A1969932D987D7');
        expect(sorted.mosaics[2].id.toHex()).to.be.equal('D525AD41D95FCF29');

    });

    it('Test Serialization and Deserialization Using namespaceIds', () => {
        const namespaceId = new NamespaceId('testaccount2');
​
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('1'),
            namespaceId,
            [NetworkCurrencyMosaic.createAbsolute(1)],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );
​
        const payload = transferTransaction.serialize();
        const newTransaction = CreateTransactionFromPayload(payload) as TransferTransaction;
        const newPayload = newTransaction.serialize();
​
        expect(newPayload).to.be.equal(payload);
        expect(newTransaction.recipientToString()).to.be.equal(transferTransaction.recipientToString());
    });
});

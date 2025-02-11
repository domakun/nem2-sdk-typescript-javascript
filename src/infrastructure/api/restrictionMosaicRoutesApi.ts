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

import localVarRequest = require('request');
import http = require('http');

/* tslint:disable:no-unused-locals */
import { AccountIds } from '../model/accountIds';
import { ModelError } from '../model/modelError';
import { MosaicAddressRestrictionDTO } from '../model/mosaicAddressRestrictionDTO';
import { MosaicGlobalRestrictionDTO } from '../model/mosaicGlobalRestrictionDTO';
import { MosaicIds } from '../model/mosaicIds';

import { ObjectSerializer, Authentication, VoidAuth } from '../model/models';

let defaultBasePath = 'http://localhost:3000';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum RestrictionMosaicRoutesApiApiKeys {
}

export class RestrictionMosaicRoutesApi {
    protected _basePath = defaultBasePath;
    protected defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    protected authentications = {
        'default': <Authentication>new VoidAuth(),
    }

    constructor(basePath?: string);
    constructor(basePathOrUsername: string, password?: string, basePath?: string) {
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        } else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername
            }
        }
    }

    set useQuerystring(value: boolean) {
        this._useQuerystring = value;
    }

    set basePath(basePath: string) {
        this._basePath = basePath;
    }

    get basePath() {
        return this._basePath;
    }

    public setDefaultAuthentication(auth: Authentication) {
        this.authentications.default = auth;
    }

    public setApiKey(key: RestrictionMosaicRoutesApiApiKeys, value: string) {
        (this.authentications as any)[RestrictionMosaicRoutesApiApiKeys[key]].apiKey = value;
    }

    /**
     * Get mosaic address restriction.
     * @summary Get mosaic address restrictions for a given mosaic and account identifier.
     * @param mosaicId Mosaic identifier.
     * @param accountId Account public key or address.
     */
    public async getMosaicAddressRestriction (mosaicId: string, accountId: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MosaicAddressRestrictionDTO;  }> {
        const localVarPath = this.basePath + '/restrictions/mosaic/{mosaicId}/address/{accountId}'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)))
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicAddressRestriction.');
        }

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getMosaicAddressRestriction.');
        }

        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        let authenticationPromise = Promise.resolve();
        authenticationPromise = authenticationPromise.then(() => this.authentications.default.applyToRequest(localVarRequestOptions));
        return authenticationPromise.then(() => {
            if (Object.keys(localVarFormParams).length) {
                if (localVarUseFormData) {
                    (<any>localVarRequestOptions).formData = localVarFormParams;
                } else {
                    localVarRequestOptions.form = localVarFormParams;
                }
            }
            return new Promise<{ response: http.ClientResponse; body: MosaicAddressRestrictionDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MosaicAddressRestrictionDTO");
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            resolve({ response: response, body: body });
                        } else {
                            reject({ response: {
                                                 statusCode: response.statusCode,
                                                 statusMessage: response.statusMessage,
                                               }, body: response.body });
                        }
                    }
                });
            });
        });
    }
    /**
     * Get mosaic address restrictions.
     * @summary Get mosaic address restrictions for a given mosaic and account identifiers array.
     * @param mosaicId Mosaic identifier.
     * @param accountIds 
     */
    public async getMosaicAddressRestrictions (mosaicId: string, accountIds?: AccountIds, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: Array<MosaicAddressRestrictionDTO>;  }> {
        const localVarPath = this.basePath + '/restrictions/mosaic/{mosaicId}'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicAddressRestrictions.');
        }

        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(accountIds, "AccountIds")
        };

        let authenticationPromise = Promise.resolve();
        authenticationPromise = authenticationPromise.then(() => this.authentications.default.applyToRequest(localVarRequestOptions));
        return authenticationPromise.then(() => {
            if (Object.keys(localVarFormParams).length) {
                if (localVarUseFormData) {
                    (<any>localVarRequestOptions).formData = localVarFormParams;
                } else {
                    localVarRequestOptions.form = localVarFormParams;
                }
            }
            return new Promise<{ response: http.ClientResponse; body: Array<MosaicAddressRestrictionDTO>;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "Array<MosaicAddressRestrictionDTO>");
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            resolve({ response: response, body: body });
                        } else {
                            reject({ response: {
                                                 statusCode: response.statusCode,
                                                 statusMessage: response.statusMessage,
                                               }, body: response.body });
                        }
                    }
                });
            });
        });
    }
    /**
     * Get mosaic global restriction.
     * @summary Get mosaic global restriction for a given mosaic identifier.
     * @param mosaicId Mosaic identifier.
     */
    public async getMosaicGlobalRestriction (mosaicId: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MosaicGlobalRestrictionDTO;  }> {
        const localVarPath = this.basePath + '/restrictions/mosaic/{mosaicId}'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicGlobalRestriction.');
        }

        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        let authenticationPromise = Promise.resolve();
        authenticationPromise = authenticationPromise.then(() => this.authentications.default.applyToRequest(localVarRequestOptions));
        return authenticationPromise.then(() => {
            if (Object.keys(localVarFormParams).length) {
                if (localVarUseFormData) {
                    (<any>localVarRequestOptions).formData = localVarFormParams;
                } else {
                    localVarRequestOptions.form = localVarFormParams;
                }
            }
            return new Promise<{ response: http.ClientResponse; body: MosaicGlobalRestrictionDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MosaicGlobalRestrictionDTO");
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            resolve({ response: response, body: body });
                        } else {
                            reject({ response: {
                                                 statusCode: response.statusCode,
                                                 statusMessage: response.statusMessage,
                                               }, body: response.body });
                        }
                    }
                });
            });
        });
    }
    /**
     * Get mosaic global restrictions.
     * @summary Get mosaic global restrictions for an array of mosaics.
     * @param mosaicIds 
     */
    public async getMosaicGlobalRestrictions (mosaicIds: MosaicIds, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: Array<MosaicGlobalRestrictionDTO>;  }> {
        const localVarPath = this.basePath + '/restrictions/mosaic';
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'mosaicIds' is not null or undefined
        if (mosaicIds === null || mosaicIds === undefined) {
            throw new Error('Required parameter mosaicIds was null or undefined when calling getMosaicGlobalRestrictions.');
        }

        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(mosaicIds, "MosaicIds")
        };

        let authenticationPromise = Promise.resolve();
        authenticationPromise = authenticationPromise.then(() => this.authentications.default.applyToRequest(localVarRequestOptions));
        return authenticationPromise.then(() => {
            if (Object.keys(localVarFormParams).length) {
                if (localVarUseFormData) {
                    (<any>localVarRequestOptions).formData = localVarFormParams;
                } else {
                    localVarRequestOptions.form = localVarFormParams;
                }
            }
            return new Promise<{ response: http.ClientResponse; body: Array<MosaicGlobalRestrictionDTO>;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "Array<MosaicGlobalRestrictionDTO>");
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            resolve({ response: response, body: body });
                        } else {
                            reject({ response: {
                                                 statusCode: response.statusCode,
                                                 statusMessage: response.statusMessage,
                                               }, body: response.body });
                        }
                    }
                });
            });
        });
    }
}

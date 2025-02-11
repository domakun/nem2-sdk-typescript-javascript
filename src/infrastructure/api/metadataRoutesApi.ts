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
import { MetadataDTO } from '../model/metadataDTO';
import { MetadataEntriesDTO } from '../model/metadataEntriesDTO';
import { ModelError } from '../model/modelError';

import { ObjectSerializer, Authentication, VoidAuth } from '../model/models';

let defaultBasePath = 'http://localhost:3000';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum MetadataRoutesApiApiKeys {
}

export class MetadataRoutesApi {
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

    public setApiKey(key: MetadataRoutesApiApiKeys, value: string) {
        (this.authentications as any)[MetadataRoutesApiApiKeys[key]].apiKey = value;
    }

    /**
     * Returns the account metadata given an account id.
     * @summary Get account metadata
     * @param accountId Account public key or address.
     * @param pageSize Number of transactions to return for each request.
     * @param id Metadata identifier up to which metadata are returned.
     * @param ordering Ordering criteria: * -id - Descending order by id. * id - Ascending order by id. 
     */
    public async getAccountMetadata (accountId: string, pageSize?: number, id?: string, ordering?: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }> {
        const localVarPath = this.basePath + '/metadata/account/{accountId}'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountMetadata.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['pageSize'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (id !== undefined) {
            localVarQueryParameters['id'] = ObjectSerializer.serialize(id, "string");
        }

        if (ordering !== undefined) {
            localVarQueryParameters['ordering'] = ObjectSerializer.serialize(ordering, "string");
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
            return new Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataEntriesDTO");
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
     * Returns the account metadata given an account id and a key.
     * @summary Get account metadata
     * @param accountId Account public key or address.
     * @param key Metadata key.
     */
    public async getAccountMetadataByKey (accountId: string, key: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }> {
        const localVarPath = this.basePath + '/metadata/account/{accountId}/key/{key}'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)))
            .replace('{' + 'key' + '}', encodeURIComponent(String(key)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountMetadataByKey.');
        }

        // verify required parameter 'key' is not null or undefined
        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getAccountMetadataByKey.');
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
            return new Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataEntriesDTO");
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
     * Returns the account metadata given an account id, a key, and a sender.
     * @summary Get account metadata
     * @param accountId Account public key or address.
     * @param key Metadata key.
     * @param publicKey Account public key.
     */
    public async getAccountMetadataByKeyAndSender (accountId: string, key: string, publicKey: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataDTO;  }> {
        const localVarPath = this.basePath + '/metadata/account/{accountId}/key/{key}/sender/{publicKey}'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)))
            .replace('{' + 'key' + '}', encodeURIComponent(String(key)))
            .replace('{' + 'publicKey' + '}', encodeURIComponent(String(publicKey)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountMetadataByKeyAndSender.');
        }

        // verify required parameter 'key' is not null or undefined
        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getAccountMetadataByKeyAndSender.');
        }

        // verify required parameter 'publicKey' is not null or undefined
        if (publicKey === null || publicKey === undefined) {
            throw new Error('Required parameter publicKey was null or undefined when calling getAccountMetadataByKeyAndSender.');
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
            return new Promise<{ response: http.ClientResponse; body: MetadataDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataDTO");
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
     * Returns the mosaic metadata given a mosaic id.
     * @summary Get mosaic metadata
     * @param mosaicId Mosaic identifier.
     * @param pageSize Number of transactions to return for each request.
     * @param id Metadata identifier up to which metadata are returned.
     * @param ordering Ordering criteria: * -id - Descending order by id. * id - Ascending order by id. 
     */
    public async getMosaicMetadata (mosaicId: string, pageSize?: number, id?: string, ordering?: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }> {
        const localVarPath = this.basePath + '/metadata/mosaic/{mosaicId}'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicMetadata.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['pageSize'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (id !== undefined) {
            localVarQueryParameters['id'] = ObjectSerializer.serialize(id, "string");
        }

        if (ordering !== undefined) {
            localVarQueryParameters['ordering'] = ObjectSerializer.serialize(ordering, "string");
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
            return new Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataEntriesDTO");
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
     * Returns the mosaic metadata given a mosaic id and a key.
     * @summary Get mosaic metadata
     * @param mosaicId Mosaic identifier.
     * @param key Metadata key.
     */
    public async getMosaicMetadataByKey (mosaicId: string, key: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }> {
        const localVarPath = this.basePath + '/metadata/mosaic/{mosaicId}/key/{key}'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)))
            .replace('{' + 'key' + '}', encodeURIComponent(String(key)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicMetadataByKey.');
        }

        // verify required parameter 'key' is not null or undefined
        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getMosaicMetadataByKey.');
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
            return new Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataEntriesDTO");
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
     * Returns the mosaic metadata given a mosaic id, a key, and a sender.
     * @summary Get mosaic metadata
     * @param mosaicId Mosaic identifier.
     * @param key Metadata key.
     * @param publicKey Account public key.
     */
    public async getMosaicMetadataByKeyAndSender (mosaicId: string, key: string, publicKey: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataDTO;  }> {
        const localVarPath = this.basePath + '/metadata/mosaic/{mosaicId}/key/{key}/sender/{publicKey}'
            .replace('{' + 'mosaicId' + '}', encodeURIComponent(String(mosaicId)))
            .replace('{' + 'key' + '}', encodeURIComponent(String(key)))
            .replace('{' + 'publicKey' + '}', encodeURIComponent(String(publicKey)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'mosaicId' is not null or undefined
        if (mosaicId === null || mosaicId === undefined) {
            throw new Error('Required parameter mosaicId was null or undefined when calling getMosaicMetadataByKeyAndSender.');
        }

        // verify required parameter 'key' is not null or undefined
        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getMosaicMetadataByKeyAndSender.');
        }

        // verify required parameter 'publicKey' is not null or undefined
        if (publicKey === null || publicKey === undefined) {
            throw new Error('Required parameter publicKey was null or undefined when calling getMosaicMetadataByKeyAndSender.');
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
            return new Promise<{ response: http.ClientResponse; body: MetadataDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataDTO");
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
     * Returns the namespace metadata given a namespace id.
     * @summary Get namespace metadata
     * @param namespaceId Namespace identifier.
     * @param pageSize Number of transactions to return for each request.
     * @param id Metadata identifier up to which metadata are returned.
     * @param ordering Ordering criteria: * -id - Descending order by id. * id - Ascending order by id. 
     */
    public async getNamespaceMetadata (namespaceId: string, pageSize?: number, id?: string, ordering?: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }> {
        const localVarPath = this.basePath + '/metadata/namespace/{namespaceId}'
            .replace('{' + 'namespaceId' + '}', encodeURIComponent(String(namespaceId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'namespaceId' is not null or undefined
        if (namespaceId === null || namespaceId === undefined) {
            throw new Error('Required parameter namespaceId was null or undefined when calling getNamespaceMetadata.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['pageSize'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (id !== undefined) {
            localVarQueryParameters['id'] = ObjectSerializer.serialize(id, "string");
        }

        if (ordering !== undefined) {
            localVarQueryParameters['ordering'] = ObjectSerializer.serialize(ordering, "string");
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
            return new Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataEntriesDTO");
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
     * Returns the namespace metadata given a namespace id and a key.
     * @summary Get namespace metadata
     * @param namespaceId Namespace identifier.
     * @param key Metadata key.
     */
    public async getNamespaceMetadataByKey (namespaceId: string, key: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }> {
        const localVarPath = this.basePath + '/metadata/namespace/{namespaceId}/key/{key}'
            .replace('{' + 'namespaceId' + '}', encodeURIComponent(String(namespaceId)))
            .replace('{' + 'key' + '}', encodeURIComponent(String(key)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'namespaceId' is not null or undefined
        if (namespaceId === null || namespaceId === undefined) {
            throw new Error('Required parameter namespaceId was null or undefined when calling getNamespaceMetadataByKey.');
        }

        // verify required parameter 'key' is not null or undefined
        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getNamespaceMetadataByKey.');
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
            return new Promise<{ response: http.ClientResponse; body: MetadataEntriesDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataEntriesDTO");
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
     * Returns the namespace metadata given a namespace id, a key, and a sender.
     * @summary Get namespace metadata
     * @param namespaceId Namespace identifier.
     * @param key Metadata key.
     * @param publicKey Account public key.
     */
    public async getNamespaceMetadataByKeyAndSender (namespaceId: string, key: string, publicKey: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: MetadataDTO;  }> {
        const localVarPath = this.basePath + '/metadata/namespace/{namespaceId}/key/{key}/sender/{publicKey}'
            .replace('{' + 'namespaceId' + '}', encodeURIComponent(String(namespaceId)))
            .replace('{' + 'key' + '}', encodeURIComponent(String(key)))
            .replace('{' + 'publicKey' + '}', encodeURIComponent(String(publicKey)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'namespaceId' is not null or undefined
        if (namespaceId === null || namespaceId === undefined) {
            throw new Error('Required parameter namespaceId was null or undefined when calling getNamespaceMetadataByKeyAndSender.');
        }

        // verify required parameter 'key' is not null or undefined
        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling getNamespaceMetadataByKeyAndSender.');
        }

        // verify required parameter 'publicKey' is not null or undefined
        if (publicKey === null || publicKey === undefined) {
            throw new Error('Required parameter publicKey was null or undefined when calling getNamespaceMetadataByKeyAndSender.');
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
            return new Promise<{ response: http.ClientResponse; body: MetadataDTO;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        body = ObjectSerializer.deserialize(body, "MetadataDTO");
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

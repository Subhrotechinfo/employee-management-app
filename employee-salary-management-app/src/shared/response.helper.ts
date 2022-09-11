import {HttpStatus} from "@nestjs/common";
export let sendCreated = async function (res, data: any, message: string = null) {
    return res.status(HttpStatus.CREATED).send({
        status: true,
        status_code: HttpStatus.CREATED,
        data: data,
        response_id : res['response_id'],
        message: message ? message : await res.req.i18nService.translate('messages.accepted', {lang: res.req.i18nLang})
    });
};

export let sendInternalServerError = async function (res, err: any, message: string = null) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: err,
        response_id : res['response_id'],
        message: message ? message : await res.req.i18nService.translate('messages.server_error', {lang: res.req.i18nLang})
    });
};


export let sendAccepted = async function (res, data: any, message: string = null) {
    return res.status(HttpStatus.OK).send({
        status: true,
        status_code: HttpStatus.OK,
        data: data,
        response_id : res['response_id'],
        message: message ? message : await res.req.i18nService.translate('messages.accepted', {lang: res.req.i18nLang})
    });
};


export let sendBadRequest = async function (res, err: any, message: string = null) {
    return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        status_code: HttpStatus.BAD_REQUEST,
        error: err,
        response_id : res['response_id'],
        message: message ? message : await res.req.i18nService.translate('messages.bad_request', {lang: res.req.i18nLang})
    });
};
export let sendNotFound = async function (res, err: any, message: string = null) {
    return res.status(HttpStatus.NOT_FOUND).send({
        status: false,
        status_code: HttpStatus.NOT_FOUND,
        error: err,
        response_id : res['response_id'],
        message: message ? message : await res.req.i18nService.translate('messages.not_found', {lang: res.req.i18nLang})
    });
};
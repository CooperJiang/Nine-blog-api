const { CODE_ERROR, CODE_SUCCESS, CODE_TOKEN_EXPIRED, CODE_REPEAT, CODE_WARNING } = require('../setting/constant')


/**
 * 统一封装返回值的格式
 */


class Result {
    constructor ( data, msg = '操作成功', options) {
        this.data = null
        if(arguments.length === 0){
            this.msg = '操作成功'
        } else if (arguments.length === 1) {
            this.msg = data
        } else {
            this.data = data 
            this.msg = msg 
            if(options) {
                this.options = options
            }
        }
    }

    createResult() {
        if (!this.code) {
            this.code = CODE_SUCCESS
        }
        let base = {
            code: this.code,
            msg: this.msg
        }

        if (this.data) {
            base.data = this.data
        }

        if (this.options) {
            base = { ...base, ...this.options}
        }
        return base;
    }

    json(res) {
        res.json(this.createResult())
    }

    success(res) {
        this.code = CODE_SUCCESS
        this.json(res)
    }

    fail(res) {
        this.code = CODE_ERROR
        this.json(res)
    }

    warning(res) {
        this.code = CODE_WARNING
        this.json(res)
    }

    repeat(res){
        this.code = CODE_REPEAT
        this.json(res)
    }

    jwtError(res) {
        this.code = CODE_TOKEN_EXPIRED
        this.json(res)
    }
}

module.exports = Result
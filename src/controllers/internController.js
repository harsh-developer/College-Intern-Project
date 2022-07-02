const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validator = require('validator');
const { default: mongoose } = require("mongoose");

// ====================================================================================================================================== >

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number') return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


// =======================================================================================================================================>


const internCreate = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let requestBody = req.body

        // validation user entry or  req.body

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern  details' })
            return
        }

        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }

        if (!isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: 'email is required' })
            return
        }

        if (!isValid(requestBody.mobile)) {
            res.status(400).send({ status: false, message: 'mobile number is required' })
            return
        }


        if (!isValid(requestBody.collegeName)) {
            res.status(400).send({ status: false, message: 'proper college name is required' })
            return
        }

        // email unique validation

        if (!(validator.isEmail(requestBody.email))) {
            return res.status(400).send({ status: false, message: 'enter valid email' })
        }

        // number unique validation

        let check1 = requestBody.mobile
        let check2 = (/^[6-9]{1}\d{9}$/.test(requestBody.mobile))

        if (!(check1.length === 10 && check2)) {
            return res.status(400).send({ status: false, message: 'enter valid number' })
        }

        let mobileCheck = await internModel.findOne({ mobile: requestBody.mobile })
        if (mobileCheck) {
            return res.status(400).send({ status: false, message: "this mobile number is already exist" })
        }
        // validate given college exist or not


        const collegeId = await collegeModel.findOne({ name: requestBody.collegeName, isDeleted: false }).select({ _id: 1 })
        if (!collegeId) {
            return res.status(400).send({ status: false, message: 'college not found' })
        }


        let emailCheck = await internModel.findOne({ email: requestBody.email })
        if (emailCheck) {
            return res.status(400).send({ status: false, message: "this email already exist" })
        }

        // number unique validation 


        // craete data in intern model first method

        req.body.collegeId = collegeId._id

        const internCreate = await internModel.create(requestBody)
        res.status(201).send({ status: true, data: internCreate })

        //  create data in intern second method
        // const createIntern = {
        //     name: req.body.name,
        //     email: req.body.email,
        //     mobile: req.body.mobile,
        //     collegeId: collegeId._id
        // }
        // const internCreate = await internModel.create(createIntern)
        // res.status(200).send({ status: true, data: internCreate })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// ======================================================================================================================================>

module.exports.internCreate = internCreate;

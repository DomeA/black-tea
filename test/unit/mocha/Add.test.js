import {Add} from "../../../src/core/Add";

const chai = require('chai');
const expect = chai.expect;

describe("Add_test",function () {
    it("getB test",()=>{
        let result = new Add();
        expect(result.getA(1,2)).to.equal(3);
    });
    it("getZ test",()=>{
        expect(Add.getB()).to.equal(3);
    })
});
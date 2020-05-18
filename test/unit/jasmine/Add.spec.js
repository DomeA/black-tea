import {Add} from "../../../src/core/Add";

describe("Add_test",function () {
    it("getA test",()=>{
        expect(Add.getB()).toBe(3);
    });
    it("getB test",()=>{
        let result = new Add();
        expect(result.getA(1,2)).toBe(3);
    })
});
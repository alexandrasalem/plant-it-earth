describe("Jest is working properly", () => {
    it('1 + 1 = 2', () =>{
        function sum (x,y){
            return x+y;
        }
        let result= sum(1,1);
        expect(result).toBe(2);
    })
});
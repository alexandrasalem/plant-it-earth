// const { ExpectationFailed } = require("http-errors");
const controllerFunctions= require("../controllers/plant");
const creds= require("../credentials");
var db = require("../database");

describe("getTrefle return data should have certain attributes formatted properly for pug", () => {
    it('cleanedData should contain a common name', done =>{
        const trefleQuery= 'https://trefle.io/api/v1/plants/'+182512+`/?token=${creds.token}`; //this is a plant known to have the necessary attributes
        controllerFunctions.getTrefle(trefleQuery)
        .then(result => {
            try {   
                expect(result["Common name"]).toBe('garden tomato');
                done();
            }
            catch (error) {
                done(error);
            }
        }); 
    })
    it('cleanedData should contain a scientific name', done =>{
        const trefleQuery= 'https://trefle.io/api/v1/plants/'+182512+`/?token=${creds.token}`; //this is a plant known to have the necessary attributes
        controllerFunctions.getTrefle(trefleQuery)
        .then(result => {
            try {   
                expect(result["Scientific name"]).toBe('Solanum lycopersicum');
                done();
            }
            catch (error) {
                done(error);
            }
        }); 
    })
})


//this test is currently having a teardown issue
describe("postPlantQ", () => {
    beforeEach(() => {
        controllerFunctions.wipeUser('test');
    });

    afterAll(() => {
        controllerFunctions.wipeUser('test');
    });

    it("if a question is posted with a new user, a new user should be added", done => {
        controllerFunctions.postPlantQ('test', 'Is this test working?', 'garden tomato', 182512)
        .then(result => {
            //check database for 'test' user
            db.query(`
                SELECT * 
                FROM users
                WHERE username='test'
            `)
            .then(result => {
                try{
                    console.log(result);
                    expect(result.rows[0]).not.toBeUndefined();
                    done();
                }
                catch (error) { 
                    console.log(error);
                    done(error);
                }
            })
        })
        .catch(error => {
            done(error);
        })
    });
});
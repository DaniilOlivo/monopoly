const chai = require("chai")
const chaiHttp = require("chai-http")

const server = require("../app")

const assert = chai.assert
chai.use(chaiHttp)

describe("api http", () => {
    const requester = chai.request(server).keepOpen()

    const titleRoom = "Hell"

    describe("create", () => {
        it("successful create", (done) => {
            requester.post("/api/create")
                .send({
                    title: titleRoom
                })
                .end((err, res) => {
                    assert.isNull(err)
                    assert.equal(res.status, 200)
                    const {ok, desc} = JSON.parse(res.text)
                    assert.isTrue(ok)
                    assert.equal(desc, "Room created")
                    done()
                })
        })

        it("create exist room", (done) => {
            requester.post("/api/create")
                .send({
                    title: titleRoom
                })
                .end((err, res) => {
                    assert.isNull(err)
                    assert.equal(res.status, 200)
                    const {ok, desc} = JSON.parse(res.text)
                    assert.isFalse(ok)
                    assert.equal(desc, "There is already a room with that name")
                    done()
                })
        })
    })

    describe("list", () => {
        it("get list", () => {
            requester.get("/api/list")
                .end((err, res) => {
                    assert.isNull(err)
                    assert.equal(res.status, 200)
                    const list = JSON.parse(res.text)
                    assert.deepEqual(list, [titleRoom])
                })
        })
    })

    after(() => {
        requester.close()
    })
})

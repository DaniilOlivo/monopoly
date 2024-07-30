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
        it("get list", (done) => {
            requester.get("/api/list")
                .end((err, res) => {
                    assert.isNull(err)
                    assert.equal(res.status, 200)
                    const list = JSON.parse(res.text)
                    assert.deepEqual(list, [
                        {
                            count: 0,
                            status: "lobby",
                            title: "Hell"
                        }
                    ])
                    done()
                })
        })
    })

    describe("delete room", () => {
        it("successful delete", (done) => {
            requester.post("/api/delete")
                .send({
                    title: titleRoom
                })
                .end((err, res) => {
                    assert.isNull(err)
                    assert.equal(res.status, 200)
                    const {ok, desc} = JSON.parse(res.text)
                    assert.isTrue(ok)
                    assert.equal(desc, "Room deleted")
                    done()
                })
        })

        it("deleting a non-existing room", (done) => {
            requester.post("/api/delete")
                .send({
                    title: titleRoom
                })
                .end((err, res) => {
                    assert.isNull(err)
                    assert.equal(res.status, 200)
                    const {ok, desc} = JSON.parse(res.text)
                    assert.isFalse(ok)
                    assert.equal(desc, "There is no such room")
                    done()
                })
        })
    })

    after(() => {
        requester.close()
    })
})

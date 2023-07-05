const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let testId;

suite("Functional Tests", () => {
  suite('POST request to "/api/issues/apitest"', () => {
    test("Create issue with every field", (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "IssueTitle",
          issue_text: "issuetext",
          created_by: "createdby",
          assigned_to: "assignedto",
          status_text: "statustext"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "IssueTitle");
          assert.equal(res.body.issue_text, "issuetext");
          assert.equal(res.body.created_by, "createdby");
          assert.equal(res.body.assigned_to, "assignedto");
          assert.equal(res.body.status_text, "statustext");
          assert.isTrue(res.body.open);
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          testId = res.body._id;
          done();
        });
    });

    test("Create issue with only required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Required Only Title",
          issue_text: "required only text",
          created_by: "required only created by"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Required Only Title");
          assert.equal(res.body.issue_text, "required only text");
          assert.equal(res.body.created_by, "required only created by");
          assert.property(res.body, "assigned_to");
          assert.property(res.body, "status_text");
          assert.isTrue(res.body.open);
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          done();
        });
    });

    test("Create issue with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({ issue_title: "Title" })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET request to '/api/issues/apitest'", () => {
    test("View issues on project", (done) => {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .query({})
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          done();
        });
    });

    test("View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .query({ issue_title: "IssueTitle" })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].issue_title, "IssueTitle");
          assert.equal(res.body[0].issue_text, "issuetext");
          assert.equal(res.body[0].created_by, "createdby");
          assert.equal(res.body[0].assigned_to, "assignedto");
          assert.equal(res.body[0].status_text, "statustext");
          assert.isTrue(res.body[0].open);
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          done();
        });
    });

    test("View issues on project with multiple filters", (done) => {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .query({
          issue_title: "IssueTitle",
          issue_text: "issuetext",
          created_by: "createdby"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].issue_title, "IssueTitle");
          assert.equal(res.body[0].issue_text, "issuetext");
          assert.equal(res.body[0].created_by, "createdby");
          assert.equal(res.body[0].assigned_to, "assignedto");
          assert.equal(res.body[0].status_text, "statustext");
          assert.isTrue(res.body[0].open);
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          done();
        });
    });
  });

  suite('PUT request to "/api/issues/apitest"', () => {
    test("update one field on an issue", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: testId,
          issue_title: "Updated Issue Title"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, testId);
          done();
        });
    });

    test("Update multiple fields on an issue", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: testId,
          issue_title: "Another Updated Issue",
          issue_text: "updated issue text",
          open: "false"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, testId);
          done();
        });
    });

    test("Update issue with missing _id", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({})
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    test("Update issue with no fields to update", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: testId })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, testId);
          done();
        });
    });

    test("Update field with invalid _id", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "5871dda29faedc3491ff9399",
          issue_title: "New Issue Title"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "5871dda29faedc3491ff9399");
          done();
        });
    });
  });

  suite("DELETE request to'/api/issues/apitest'", () => {
    test("delete a valid issue", (done) => {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({ _id: testId })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, testId);
          done();
        });
    });

    test("Delete an issue with invalid _id", (done) => {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({ _id: "5871dda29faedc3491ff9399" })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "5871dda29faedc3491ff9399");
          done();
        });
    });

    test("Delete an issue with missing id", (done) => {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({})
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});



after(function() {
  chai.request(server)
  .get('/')
});
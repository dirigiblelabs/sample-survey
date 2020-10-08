var rs = require("http/v4/rs");
var dao = require("survey-admin/data/dao/Survey/Answers");
var user = require("security/v4/user");

rs.service()
	.resource("")
		.get(function(ctx, request, response) {
			var entities = dao.list();
			var userId = user.getName();
			var found = false;
			for (var i = 0; i < entities.length; i ++) {
				if (entities[i].UserId === userId) {
					found = true;
					break;
				}
			}
			status = found ? response.BAD_REQUEST : response.OK;
			response.setStatus(status);
		})
	.resource("")
		.post(function(ctx, request, response) {
			var answers = request.getJSON();
			var userId = user.getName();
			for (var i = 0; i < answers.length; i ++) {
				dao.create({
					QuestionId: answers[i].QuestionId,
					Answer: answers[i].Answer,
					UserId: userId
				});
			}
			response.setStatus(response.OK)
		})
.execute();

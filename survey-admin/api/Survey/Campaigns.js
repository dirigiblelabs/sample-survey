var rs = require("http/v4/rs");
var dao = require("survey-admin/data/dao/Survey/Campaigns");
var http = require("survey-admin/api/http");

rs.service()
	.resource("")
		.get(function(ctx, request) {
			var queryOptions = {};
			var parameters = request.getParameterNames();
			for (var i = 0; i < parameters.length; i ++) {
				queryOptions[parameters[i]] = request.getParameter(parameters[i]);
			}
			var entities = dao.list(queryOptions);
			http.sendResponseOk(entities);
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("count")
		.get(function(ctx, request) {
			http.sendResponseOk(dao.count());
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.get(function(ctx) {
			var id = ctx.pathParameters.id;
			var entity = dao.get(id);
			if (entity) {
			    http.sendResponseOk(entity);
			} else {
				http.sendResponseNotFound("Campaigns not found");
			}
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("")
		.post(function(ctx, request, response) {
			var entity = request.getJSON();
			entity.Id = dao.create(entity);
			response.setHeader("Content-Location", "/services/v4/js/survey-admin/api/Campaigns.js/" + entity.Id);
			http.sendResponseCreated(entity);
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.put(function(ctx, request) {
			var entity = request.getJSON();
			entity.Id = ctx.pathParameters.id;
			dao.update(entity);
			http.sendResponseOk(entity);
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.delete(function(ctx) {
			var id = ctx.pathParameters.id;
			var entity = dao.get(id);
			if (entity) {
				dao.delete(id);
				http.sendResponseNoContent();
			} else {
				http.sendResponseNotFound("Campaigns not found");
			}
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
.execute();

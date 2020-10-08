angular.module('survey', ['mgo-angular-wizard']);
angular.module('survey')
.factory('httpRequestInterceptor', function () {
	var csrfToken = null;
	return {
		request: function (config) {
			config.headers['X-Requested-With'] = 'Fetch';
			config.headers['X-CSRF-Token'] = csrfToken ? csrfToken : 'Fetch';
			return config;
		},
		response: function(response) {
			var token = response.headers()['x-csrf-token'];
			if (token) {
				csrfToken = token;
			}
			return response;
		}
	};
})
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
}])
.controller('PageController', function ($scope, $http, WizardHandler) {

    $scope.answers = {};

    $scope.yesNoOptions = [{
        Value: "Yes"
    }, {
        Value: "No"
    }];

    $scope.finishedWizard = function() {
		var answers = [];
		getAnswers(answers, "freeText");
		getAnswers(answers, "yesNo");
		getAnswers(answers, "singleChoice");
		getAnswers(answers, "multipleChoice");
		
		submitAnswers(answers, function(data) {
			alert("Answers successfully sumbited");
			$scope.answers = {};
			$scope.finished = true;
		}, function(data) {
			alert("Error occured while submitting answers: " + JSON.stringify(data))
		});
    };

	function getAnswers(answers, type) {
		for (var key in $scope.answers[type]) {
			var answer = $scope.answers[type][key];
			if (answer instanceof Object) {
				var multipleAnswers = [];
				for (var nextAnswer in answer) {
					multipleAnswers.push(answer[nextAnswer]);
				}
				answer = multipleAnswers.join(", ");
			}
			answers.push({
				QuestionId: key,
				Answer: answer
			});
		}
	}

    $scope.cancelledWizard = function() {
        if(confirm("Do you really want to cancel the curent progress?")) {
            $scope.answers = {};
            WizardHandler.wizard().reset();
        }
    }

	var oDataApi = '/odata/v2/Questions?$expand=QuestionOptions&$format=json';
	var answersApi = '/services/v4/js/survey/api/Answers.js';

	$http.get(answersApi)
	.error(function() {
		$scope.finished = true;
	});

	$scope.loadQuestions = function() {
		$http.get(oDataApi)
		.success(function(data) {
            $scope.questions = data.d.results.map(e => {
                return {
                    Id: e.Id,
                    Title: e.Title,
                    Text: e.Text,
                    QuestionType: getQuestionType(e.QuestionType),
                    QuestionOptions: e.QuestionOptions ? e.QuestionOptions.results.map(o => o.Value) : []
                }
            });
            console.log($scope.questions);
		});
	};
	$scope.loadQuestions();

	function submitAnswers(answers, onSuccess, onError) {
		$http.post(answersApi, JSON.stringify(answers))
		.success(function(data) {
			if (onSuccess) {
				onSuccess(data);
			}
		}).error(function(data) {
			if (onError) {
				onError(data);
			}
		});
	};
    function getQuestionType(questionTypeId) {
        switch(questionTypeId) {
            case 1001:
                return "free-text";
            case 1002:
                return "yes-no";
            case 1003:
                return "single-choice";
            case 1004:
                return "multiple-choice";
        }
        return "free-text";
    }
});

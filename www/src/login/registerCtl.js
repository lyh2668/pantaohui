angular.module('Login', [])

.controller('RegisterCtl', function($scope, $ionicPopup, $timeout, registerService, AuthService, $state) {

	$scope.registerData = {
		username: '',
		password: '',
		code: ''
	}

	$scope.submitRegister = function() {

		var tel = $scope.registerData.username;
		var pwd = $scope.registerData.password;
		var code = $scope.registerData.code;

		if (registerService.checkMobile(tel) && registerService.checkPwd(pwd)) {
			registerService.register(tel, pwd, code).then( function(data) {
				AuthService.login(tel, pwd, "注册成功，准备登录...").then(function() {
					$state.go("tabs.mine");
				})
			}, function(err) {
				$ionicPopup.alert({
					title: '错误',
					template: err.errmsg
				})
			});
		} else {
			$ionicPopup.alert({
				title: '错误',
				template: '请输入正确格式的手机号码与密码(密码不能太简单)'
			})
		}
		console.log('submit: ', $scope.registerData);
		
	}

	$scope.sendCode = function() {
		console.log('username:', $scope.registerData.username);

		var tel = $scope.registerData.username;

		if(registerService.checkMobile(tel)) {
			registerService.getCode(tel, 0).then(function(data) {
				$ionicPopup.alert({
					template: '验证码已发送到您手机，请查收'
				})

				$scope.codeSendOk = true;
				countDown();
			}, function(err) {
				$ionicPopup.alert({
					title: '错误',
					template: err.errmsg
				})
			})
		} else {
			$ionicPopup.alert({
				title: '错误',
				template: '<p style="text-align: center">请输入正确格式的手机号码</p>'
			})
		}
	}

	$scope.count = 60;
	$scope.codeSendOk = false;
	function countDown() {
		var timer = $timeout(function() {
			if ($scope.count > 0) {
				--$scope.count;
				countDown();
			} else {
				$scope.codeSendOk = false;
			}
		}, 1000);

		timer.then(function() {
			
		})
	}
	


})
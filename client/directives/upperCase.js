

 angular.module('inoxica').directive('uppercaseOnly', [
  // Dependencies

  // Directive
  function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        element.on('keypress', function(e) {
          var char = e.char || String.fromCharCode(e.charCode);
          if (!/^[A-Z0-9]$/i.test(char)) {
            e.preventDefault();
            return false;
          }
        });

        function parser(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }
          var formatedValue = value.toUpperCase();
          if (ctrl.$viewValue !== formatedValue) {
            ctrl.$setViewValue(formatedValue);
            ctrl.$render();
          }
          return formatedValue;
        }

        function formatter(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }
          return value.toUpperCase();
        }

        ctrl.$formatters.push(formatter);
        ctrl.$parsers.push(parser);
      }
    };
  }
]);


// angular.module('inoxica').directive('uppercaseOnly', [
  
//   function() {
//     return {
//       restrict: 'A',
//       require: 'ngModel',
//       link: function(scope, element, attrs, ctrl) {
//         element.on('keypress', function(e) {
//           var char = e.char || String.fromCharCode(e.charCode);
//           if (!/^[A-Z0-9]$/i.test(char)) {
//             e.preventDefault();
//             return false;
//           }
//         });

//         function parser(value) {
//           if (ctrl.$isEmpty(value)) {
//             return value;
//           }
//           var formatedValue = value.toUpperCase();
//           if (ctrl.$viewValue !== formatedValue) {
//             ctrl.$setViewValue(formatedValue);
//             ctrl.$render();
//           }
//           return formatedValue;
//         }

//         function formatter(value) {
//           if (ctrl.$isEmpty(value)) {
//             return value;
//           }
//           return value.toUpperCase();
//         }

//         ctrl.$formatters.push(formatter);
//         ctrl.$parsers.push(parser);
//       }
//     };
//   }
// ]);
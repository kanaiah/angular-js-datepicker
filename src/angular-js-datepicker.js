(function () {
    'use strict';

    function Datepicker(scope, elem, attrs) {
        var selectedDate = scope.selectedDate ? new Date(scope.selectedDate) : new Date();
        scope.viewMonth = moment(selectedDate).format("MMMM");
        scope.viewYear = moment(selectedDate).format("YYYY");

        var getDaysArray = function (year, month) {
            var date = new Date(year, month - 1, 1);
            var result = [];
            var i =0;
            while (date.getMonth() == month - 1) {
                if (!result[i]){
                    result[i] = [];
                }
                result[i][date.getDay()] = date.getDate();
                if (date.getDay() === 6) {
                    i++;
                }
                date.setDate(date.getDate() + 1);
            }
            return result;
        };

        scope.weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        scope.dates = getDaysArray(selectedDate.getFullYear(), selectedDate.getMonth()+1);

        // var today = new Date();
        // console.log(today.getFullYear()+" "+today.getMonth());
        // console.log(getDaysArray(today.getFullYear(), today.getMonth()+1));
    }

    var module = angular.module("angularJsDatePicker", ["angularMoment"]);

    module.directive("ajDatepickerPopup", ["moment",
        function (moment) {
            return {
                restrict: "A",
                scope: {
                    selectedDate: "=",
                    minDate: "=",
                    maxDate: "="
                },
                template: `
                <div class="aj_monthly_container">
                    <div class="aj_month_container">
                        <div class="aj_month_left_arrow">
                            <button class="left_arrow">
                                <i class="material-icons">keyboard_arrow_left</i>
                            </button>
                        </div>
                        <div class="aj_month_year">
                            {{viewMonth}}
                            {{viewYear}}
                        </div>
                        <div class="aj_month_right_arrow">
                        <button class="left_arrow">
                            <i class="material-icons">keyboard_arrow_right</i>
                        </button>
                        </div>
                    </div>
                    <div class="aj_week_names_container aj_row">
                        <div class="aj_col center" ng-repeat="weekName in weekNames track by $index">
                            <div class="aj_week_name">{{weekName}}</div>
                        </div>
                    </div>
                    <div class="aj_days_container">
                        <div class="aj_row" ng-repeat="row in dates">
                            <div class="aj_col center" ng-repeat="date in row track by $index">
                                <div class="aj_day">{{date}}</div>
                            </div>
                        </div>
                    </div>
                </div>`,
                link: Datepicker
            };
        }
    ]);

    module.directive("ajDatepicker", ["moment",
        function (moment) {
            return {
                restrict: "A",
                scope: {
                    selectedDate: "=",
                    minDate: "=",
                    maxDate: "="
                },
                transclude: true,
                template: `
                <div ng-transclude></div> 
                <div aj-datepicker-popup class="aj_datepicker_popup" selected-date="selectedDate" min-date="minDate" max-date="maxDate">
                </div>`,
                link: function (scope) {
                    console.log(scope.selectedDate);
                }
            };
        }
    ]);
})();
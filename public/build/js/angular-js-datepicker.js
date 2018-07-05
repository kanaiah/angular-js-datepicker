(function () {
    'use strict';

    function Datepicker(scope, elem, attrs) {
        var selectedDate;
        var getDaysArray = function (year, month) {
            var date = new Date(year, month - 1, 1);
            var result = [];
            var i = 0;
            while (date.getMonth() == month - 1) {
                if (!result[i]) {
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

        scope.selectDate = function ($event, date) {
            scope.selectedDate = new Date(scope.getCurrentDate(date));
            console.log(scope.selectedDate);
            $event.stopPropagation();
            scope.hidePopover();
            scope.onDateSelected();
        };

        scope.getDate = function (date) {
            var date = new Date(date);
            return date.getDate();
        };

        scope.weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        function calculateValues(selectedDate) {
            scope.viewMonth = selectedDate.format("MMMM");
            scope.viewYear = selectedDate.format("YYYY");
            scope.dates = getDaysArray(scope.viewYear, selectedDate.format("M"));
        }

        function init() {
            selectedDate = scope.selectedDate ? moment(scope.selectedDate) : moment(new Date());
            calculateValues(selectedDate);
        }

        scope.nextMonth = function ($event) {
            selectedDate = moment(selectedDate).add(1, "months");
            calculateValues(selectedDate);
            $event.stopPropagation();
        };

        scope.prevMonth = function ($event) {
            selectedDate = moment(selectedDate).subtract(1, "months");
            calculateValues(selectedDate);
            $event.stopPropagation();
        };

        scope.getCurrentDate = function (date) {
            return moment(scope.viewYear + "-" + scope.viewMonth + "-" + date).format("YYYY-MMM-D");
        };

        scope.isEqualToSelectedDate = function (date) {
            var mDate = scope.getCurrentDate(date);
            var formattedSelectedDate = scope.selectedDate ? moment(scope.selectedDate).format("YYYY-MMM-D") : "";
            return moment(mDate).isSame(formattedSelectedDate);
        };

        scope.isDisabled = function (date) {
            var minDate = scope.minDate ? moment(scope.minDate).format("YYYY-MMM-D") : moment().format("YYYY-MMM-D");
            var currentDate = scope.getCurrentDate(date);
            return !moment(currentDate).isSameOrAfter(minDate);
        };

        init();
    }

    var module = angular.module("angularJsDatePicker", ["angularMoment"]);

    module.directive("ajDatepickerPopup", ["moment",
        function (moment) {
            return {
                restrict: "A",
                scope: {
                    selectedDate: "=",
                    minDate: "=",
                    maxDate: "=",
                    hidePopover: "&",
                    onDateSelected: "&"
                },
                template: `
                <div class="aj_monthly_container">
                    <div class="aj_month_container">
                        <div class="aj_month_left_arrow">
                            <button class="left_arrow" ng-click="prevMonth($event)">
                                <i class="material-icons">keyboard_arrow_left</i>
                            </button>
                        </div>
                        <div class="aj_month_year">
                            {{viewMonth}}
                            {{viewYear}}
                        </div>
                        <div class="aj_month_right_arrow">
                        <button class="left_arrow" ng-click="nextMonth($event)">
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
                            <div class="aj_col center" ng-repeat="date in row track by $index" ng-class="{'selected':isEqualToSelectedDate(date), 'aj_date':(date?true:false), 'disabled':isDisabled(date) }" ng-click="selectDate($event, date)">
                                {{date}}
                            </div>
                        </div>
                    </div>
                </div>
                `,
                link: Datepicker
            };
        }
    ]);

    module.directive("ajDatepicker", ["moment", "$timeout", "$window",
        function (moment, $timeout, $window) {
            return {
                restrict: "A",
                scope: {
                    selectedDate: "=",
                    minDate: "=",
                    maxDate: "=",
                    onDateSelected: "&"
                },
                transclude: true,
                template: `
                <span ng-transclude class="aj_datepicker_element"></span>
                <div class="aj_datepicker_backdrop" ng-if="show" ng-click="hidePopover()"></div>
                <div aj-datepicker-popup ng-show="show" hide-popover="hidePopover()" on-date-selected="onDateSelected()" class="aj_datepicker_popup" selected-date="selectedDate" min-date="minDate" max-date="maxDate">
                </div>`,
                link: function (scope, elem) {
                    scope.position = {};
                    scope.show = false;
                    var element = elem[0].getElementsByClassName('aj_datepicker_element')[0];
                    var popup = elem[0].getElementsByClassName('aj_datepicker_popup')[0];

                    var positionThePopup = function () {
                        var elementBoundingRect = element.getBoundingClientRect();
                        var popupBoundingRect = popup.getBoundingClientRect();
                        console.log(element.getBoundingClientRect());
                        console.log(popup.getBoundingClientRect());
                        console.log($window);
                        var windowWidth = $window.innerWidth;
                        var windowHeight = $window.innerHeight;

                        if (elementBoundingRect.x + popupBoundingRect.width > windowWidth) {
                            angular.element(popup).css("right", "0px").css("left", 'auto');
                        } else {
                            angular.element(popup).css("left", elementBoundingRect.x + "px").css("right", 'auto');
                        }

                        console.log(elementBoundingRect.y + popupBoundingRect.height);
                        console.log(windowHeight);
                        if (elementBoundingRect.y + popupBoundingRect.height + elementBoundingRect.height > windowHeight) {
                            var bottom = windowHeight - elementBoundingRect.y;
                            angular.element(popup).css("bottom", 0 + "px").css("top", 'auto');
                        } else {
                            var top = elementBoundingRect.y + elementBoundingRect.height;
                            angular.element(popup).css("top", top + "px").css("bottom", 'auto');
                        }
                    };

                    scope.showPopover = function () {
                        scope.$apply(function () {
                            scope.show = true;
                            $timeout(function () {
                                positionThePopup();
                            });
                        });
                    };

                    angular.element(element).on("click", function () {
                        scope.showPopover();
                    });

                    angular.element(elem).on("focus", function () {
                        scope.showPopover();
                    });

                    angular.element(elem).on("blur", function () {
                        scope.$apply(function () {
                            scope.hidePopover();
                        });
                    });

                    scope.$on('$destroy', function () {
                        angular.element(element).off("click");
                        angular.element(elem).off("blur");
                        angular.element(elem).off("focus");
                    });

                    scope.hidePopover = function () {
                        scope.show = false;
                    };
                }
            };
        }
    ]);
})();
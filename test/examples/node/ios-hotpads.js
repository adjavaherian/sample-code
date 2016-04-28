"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    q = require('q'),
    serverConfigs = require('./helpers/appium-servers');

describe("ios simple", function () {

    this.timeout(300000);
    var driver;
    var allPassed = true;

    function asyncSeries(arr) {

        return arr.reduce(function(promise, item, index) {
            return promise.delay(1000).then(function(result) {
                console.log('item', item);
                item.click().sleep(1000).click();
                //item.click().sleep(5000);
                //console.log('item', item, 'result', result, 'index', index);
                return result;
            });
        }, q(true));

    }


    before(function () {
        var serverConfig = serverConfigs.local;
            driver = wd.promiseChainRemote(serverConfig);
            require("./helpers/logging").configure(driver);

        var desired = _.clone(require("./helpers/caps").ios93);
            desired.app = "/Users/4m1r/Desktop/HotPads/ios/build/Hotpads.app";

        return driver.init(desired);
    });

    after(function () {
        return driver
          .quit()
          .finally(function () {
            if (process.env.SAUCE) {
              return driver.sauceJobStatus(allPassed);
            }
          });
    });


    it("should simply return a driver", function (done) {
        return driver.resolve()
            .then(function(){
                return driver
                    .elementsByClassName('UIAButton')
                        .then(asyncSeries)
                        .then(function(){
                            console.log('done');
                            done();
                        }, function (err) {
                            console.log('no button...', err);
                            done();
                    });

            });
    });

});

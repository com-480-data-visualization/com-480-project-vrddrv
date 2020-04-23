"use strict";

const puppeteer = require("puppeteer");

function scrapeCourses(url) {

    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(url);

            let res = await page.evaluate(() => {
                let courses = [];
                let items = document.querySelectorAll("div.cours");

                items.forEach((item) => {

                    const cName = item.querySelector('div.cours-name > a').innerText;
                    const cCode = item.querySelector('div.cours-code').innerText.trim();
                    const cSection = item.querySelector('div.section-name').innerText.trim();
                    const cProf = item.querySelector('div.enseignement-name').innerText
                        .split("\n")
                        .map((i) => {return i.trim()});

                    courses.push({
                        courseName : cName,
                        courseCode: cCode,
                        courseSection: cSection,
                        profName: cProf,
                    });
                });
                return courses;
            });

            await browser.close();
            return resolve(res);

        } catch (e) {
            return reject(e);
        }
    })
}

// Data Science 2019-20
scrapeCourses('https://edu.epfl.ch/studyplan/en/master/data-science').then(console.log).catch(console.error);


// Data Science 2019-20 course descriptions
function scrapeCourseDescription(courseName, courseCode) {

    return new Promise(async (resolve, reject) => {
        try {

            let url = 'https://edu.epfl.ch/coursebook/en/';
            const splitCourse = courseName.split(" ").map((i) => {return i.toLowerCase()});
            for(each of splitCourse) {
                url = url + each + '-';
            }
            url = url + courseCode + '?cb_cycle=bama_cyclemaster&cb_section=sc_ds';

            console.log(url);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(url);

            const [el] = await page.$x('/html/body/div[4]/div[4]');
            const res = await el.getProperty('textContent');
            const summaryRaw = await res.jsonValue();

            let start = summaryRaw.indexOf('Summary') + 7;
            let end = summaryRaw.indexOf('Content') - 1;

            const summary = summaryRaw.substring(start,end).trim();

            await browser.close();
            return resolve(summary);
        } catch (e) {
            return reject(e);
        }
    })
}

// scrapeCourseDescription('Applied data analysis','CS-401').then(console.log).catch(console.error);
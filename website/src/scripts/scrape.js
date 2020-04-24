"use strict";

const puppeteer = require("puppeteer");
const fs = require('fs');

const MASTER_CYCLE_URL = 'https://edu.epfl.ch/studyplan/en/master';

const MASTER_CYCLE_CB_SECTION = ['ing_math','ing_phys','ar','sv_b','cgc_ing','gc','sc_epfl',
                                'ma_co','in','in_cs','sc_ds','dh','el','el_ener','sie','if',
                                'shs','sv_stv','sv','mtee','mx','math','gm','mnis','mt',
                                'cgc_chim','ph_ne','phys','mt_ro'];

function scrapeMasterCycle() {

    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(MASTER_CYCLE_URL);

            let res = await page.evaluate(() => {
                let mCycles = [];
                let items = document.querySelectorAll("div.content_one_col > ul > li");

                items.forEach((item) => {
                    mCycles.push({
                        program: item.innerText
                    });
                });
                return mCycles;
            });

            await browser.close();
            return resolve(res);

        } catch (e) {
            return reject(e);
        }
    })
}

// EPFL master programs
// scrapeMasterCycle().then(console.log).catch(console.error);

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
// scrapeCourses('https://edu.epfl.ch/studyplan/en/master/data-science').then(console.log).catch(console.error);


// Data Science 2019-20 course descriptions
function scrapeCourseDescription(courseName, courseCode, cbSection) {

    return new Promise(async (resolve, reject) => {
        try {

            let url = 'https://edu.epfl.ch/coursebook/en/';
            const splitCourse = courseName.split(" ").map((i) => {return i.toLowerCase()});
            for(each of splitCourse) {
                url = url + each + '-';
            }
            url = url + courseCode + '?cb_cycle=bama_cyclemaster&cb_section=' + cbSection;

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

// scrapeCourseDescription('Applied data analysis','CS-401','sc_ds').then(console.log).catch(console.error);


async function saveAllMasterCourses(url) {
    const masterPrograms = await scrapeMasterCycle(url);

    if (!fs.existsSync('../scraped_data')){
        fs.mkdirSync('../scraped_data');
    }

    for(each of masterPrograms) {
        let program = each['program'].split(/ - |- |, | & | /).map((i) => {return i.toLowerCase()});
        let programURL = url + '/' + program.join('-');

        let courses = await scrapeCourses(programURL);
        let jsonData = await JSON.stringify(courses,null,1);

        let fileName = await (program.join('_') + '.json');
        await fs.writeFile("../scraped_data/" + fileName, jsonData, 'utf-8', (err) => {
            if(err) {
                return console.log(err);
            }
            console.log(fileName + " file successfully written!");
        });
    }
}

// TODO: integrate scrapeCourseDescription()
saveAllMasterCourses(MASTER_CYCLE_URL);
"use strict";

class Course {
  constructor(
    name,
    block,
    grade,
    credits,
    creditsBefore,
    creditsOf,
    form,
    lang,
    sdate
  ) {
    this.name = name;
    this.block = block;

    this.grade = grade;
    this.credits = credits;
    this.creditsBefore = creditsBefore;
    this.creditsOf = creditsOf;

    this.form = form;
    this.lang = lang;
    this.sdate = sdate;
  }

  getTooltipText() {
    return `${this.name}

    Grade:   ${this.grade}
    Credits: ${this.credits}

    Language:  ${this.lang}
    Exam Date: ${this.sdate}
    `;
  }
}

export class Transcript {
  constructor(classes, program) {
    this.classes = classes.map(
      (c) =>
        new Course(
          c.name,
          c.block,
          c.grade,
          c.credits,
          c.creditsBefore,
          c.creditsOf,
          c.form,
          c.lang,
          c.sdate
        )
    );
    this.program = program;
  }
}

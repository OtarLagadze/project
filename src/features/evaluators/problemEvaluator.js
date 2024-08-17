function evaluateMultipleChoice(data) {
  let pointsEarned = 0;
  let verdict = [];

  data.submission.forEach(child => {
    let answerIndex = data.answer.indexOf(child);

    if (answerIndex !== -1) {
      pointsEarned += data.point;
      verdict.push({
        value: child,
        verdict: true,
      })
      data.answer.splice(answerIndex, 1);
    } else {
      pointsEarned -= data.point / 2;
      verdict.push({
        value: child,
        verdict: false,
      })
    }
  })

  pointsEarned = Math.round(pointsEarned);

  return {
    pointsEarned: pointsEarned,
    verdict: verdict,
  }
}

function evaluateMatching(data) {
  let pointsEarned = 0;
  let verdict = [];

  data.submission.forEach((submissionChild, ind) => {
    let answerchild = data.answer.find(answerPair => answerPair.first === submissionChild.first);

    if (answerchild && submissionChild.second === answerchild.second) {
      pointsEarned += data.point;
      verdict.push({
        index: ind,
        verdict: true,
      })
    } else {
      verdict.push({
        index: ind,
        verdict: false,
      })
    }
  })

  pointsEarned = Math.round(pointsEarned);

  return {
    pointsEarned: pointsEarned,
    verdict: verdict,
  }
}

function evaluateSorting(data) {
  let pointsEarned = 0;
  let verdict = [];

  for (let i = 0; i < data.submission.length; i++) {
    if (data.submission[i] === data.answer[i]) {
      pointsEarned += data.point;
      verdict.push({
        index: i,
        verdict: true,
      })
    } else {
      verdict.push({
        index: i,
        verdict: false,
      })
    }
  }

  pointsEarned = Math.round(pointsEarned);

  return {
    pointsEarned: pointsEarned,
    verdict: verdict,
  }
}

function evaluateNumber(data) {
  let pointsEarned = 0;
  let verdict = false;

  if (data.submission === data.answer) {
    pointsEarned = data.point;
    verdict = true;
  }

  return {
    pointsEarned: pointsEarned,
    verdict: verdict,
  }
}

export function evaluateProblem(data) {
  switch (data.problemType) {
    case 'ვარიანტების არჩევა':
      return evaluateMultipleChoice(data);
    case 'შესაბამისობა':
      return evaluateMatching(data);
    case 'დალაგება':
      return evaluateSorting(data);
    case 'რიცხვის ჩაწერა':
      return evaluateNumber(data);
    case 'გამოტოვებული სიტყვები':
      return evaluateSorting(data);
    default:
      return {
        pointsEarned: 0,
        verdict: ["დაფიქსირდა შეცდომა"],
      };
  }
}
import { evaluateProblem } from "@features/evaluators/problemEvaluator"

export function evaluateTest(submissions) {
  let totalPoints = 0;
  let verdicts = [];

  submissions.forEach((data, index) => {
    const response = evaluateProblem(data);

    totalPoints += response.pointsEarned;
    verdicts.push({
      problemIndex: index,
      maxPoint: data.maxPoint,
      pointsEarned: response.pointsEarned,
      verdict: response.verdict
    })
  })

  return {
    totalPoints,
    verdicts,
  }
}
// export enum SingingGrade {
//   Great,
//   Good,
//   Bad,
//   Miss
// }


export function gradePitch(pitchDifference: Number) {
  if (pitchDifference >= 1000) {
    return "Miss"
    // return SingingGrade.Miss
  } else if (pitchDifference >= 140) {
    return "Bad"
    // return SingingGrade.Bad
  } else if (pitchDifference >= 50) {
    return "Good"
    // return SingingGrade.Good
  } else {
    return "Great"
    // return SingingGrade.Great
  }
}

import { gradePitch } from '../util/gradescoring'
import { Heading } from '@chakra-ui/react'
function ScoreReadout({ running, latestPitch }) {
  return (
    <Heading>
      {latestPitch
        ? `Score: ${gradePitch(latestPitch.toFixed(1))}`
        : running
          ? "Waiting"
          : "Waiting"}
    </Heading>
  );
}

export default ScoreReadout;

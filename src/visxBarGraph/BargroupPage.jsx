import { useState, useEffect } from "react";
import BargroupClusterChart from "./BargroupClusterChart.tsx";
import { Slider, Typography, Row, Col } from "antd";
import { fourSevenFive, guranteed, threeTwoFive } from "./data";
import { LegendOrdinal } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";

const BargroupPage = () => {
  const { Title } = Typography;

  const vw =
    Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    ) - 40;
  const vh =
    Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ) - 380;

  const [guranteedData, setGuranteedData] = useState(null);
  const [fourSevenFiveData, setFourSevenFiveData] = useState(null);
  const [threeTwoFiveData, setThreeTwoFiveData] = useState(null);

  useEffect(() => {
    setGuranteedData(guranteed);
    setFourSevenFiveData(fourSevenFive);
    setThreeTwoFiveData(threeTwoFive);
  }, []);

  const onChange = (value) => {
    if (value[0] !== value[1]) {
      setGuranteedData(guranteed.slice(value[0], value[1]));
      setFourSevenFiveData(fourSevenFive.slice(value[0], value[1]));
      setThreeTwoFiveData(threeTwoFive.slice(value[0], value[1]));
    }
  };

  const formatter = (value) => {
    return guranteed.map((item) => item.time)[value];
  };

  const marksArray = guranteed.map((item) => [
    guranteed.indexOf(item),
    item.time,
  ]);
  const marksObject = Object.fromEntries(marksArray);

  const blue = "#aeeef8";
  const green = "#e5fd3d";
  const purple = "#9caff6";

  const ordinalColorScale = scaleOrdinal({
    domain: ["Prudential", "Manulife", "AIA"],
    range: [blue, green, purple],
  });

  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <Col span={22}>
          <Title>Endowment Plan</Title>
        </Col>
        <Col span={2}>
          <LegendOrdinal
            scale={ordinalColorScale}
            style={{ fontSize: "18px", margin: "20px 20px 0 0" }}
          />
        </Col>
      </Row>
      <Title level={4}>Guranteed</Title>
      <BargroupClusterChart
        width={vw}
        height={vh / 3}
        data={guranteedData ? guranteedData : guranteed}
      />
      <Title level={4}>Illustrated at 3.25% investment return</Title>
      <BargroupClusterChart
        width={vw}
        height={vh / 3}
        data={threeTwoFiveData ? threeTwoFiveData : threeTwoFive}
      />
      <Title level={4}>Illustrated at 4.75% investment return</Title>
      <BargroupClusterChart
        width={vw}
        height={vh / 3}
        data={fourSevenFiveData ? fourSevenFiveData : fourSevenFive}
      />
      <Slider
        range
        onChange={onChange}
        defaultValue={[0, 36]}
        style={{ width: "97vw" }}
        max={36}
        min={0}
        tipFormatter={formatter}
        included={true}
        marks={marksObject}
      />
    </div>
  );
};

export default BargroupPage;

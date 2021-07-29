/* eslint react/jsx-handler-names: "off" */
import React, { useMemo } from 'react';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';

import { Group } from '@visx/group';
import { Cluster, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { LinearGradient } from '@visx/gradient';

import { Row, Col } from 'antd';

const background = '#306c90'
const citrus = '#ddf163';
const white = '#ffffff';
const merlinsbeard = '#f7f7f3';
const green = '#79d259';
const aqua = '#37ac8c';

const defaultMargin = { top: 40, left: 40, right: 40, bottom: 40 };

interface NodeShape {
  name: string;
  children?: NodeShape[];
}

type ZoomIProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  clusterData: NodeShape
  numberOfNodes: number,
};

function getItem(clusterData: any, key: String, name: String){

  const keyTyped = key as keyof typeof clusterData;

  if(clusterData.name === name){
    return clusterData[keyTyped]
  } else {
    for(var i = 0; i < clusterData.children.length; i++){
      if(clusterData.children[i].name === name){
        return clusterData.children[i][keyTyped]
      }
    }
  }
}

function Node({ node, nodeSize }: { node: HierarchyPointNode<NodeShape> , nodeSize: number}) {

  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} nodeSize={nodeSize} />;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 10 && (
        <circle
          r={nodeSize}
          fill={background}
          stroke={isParent ? white : citrus}
        />
      )}
      <text
        dy=".33em"
        fontSize={nodeSize-2}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={isParent ? white : citrus}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node, nodeSize }: { node: HierarchyPointNode<NodeShape> , nodeSize: number}) {

  const width = 3*nodeSize;
  const height = 1.5*nodeSize;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <LinearGradient id="top" from={green} to={aqua} />
      <rect width={width} height={height} y={centerY} x={centerX} fill="url('#top')" />
      <text
        dy=".33em"
        fontSize={nodeSize-2}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={background}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

export default function DendrogramChart({ width, height, margin = defaultMargin, clusterData, numberOfNodes}: ZoomIProps) {

  const data = useMemo(() => hierarchy<NodeShape>(clusterData), []);

  const nodeSize = 14
  const chartWidth = Math.max(width, nodeSize * numberOfNodes * 3)
  const chartHeight = Math.max(height, chartWidth*height/width)
  
  const xMax = chartWidth - margin.left - margin.right;
  const yMax = chartHeight - margin.top - margin.bottom;

  const initialTransform = {
    scaleX: height / chartHeight,
    scaleY: width / chartWidth,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
  };

  let tooltipTimeout: number;

  type TooltipData = {
    name: string,
    walletAddress: string,
    amount: string
  };
 
  const { containerRef, TooltipInPortal } = useTooltipInPortal({ scroll: true, });

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 500,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
  };

  const Component = () => {
    return (
      <Cluster<NodeShape> root={data} size={[xMax, yMax]}>
        {cluster => (
          <Group top={margin.top} left={margin.left}>
            {cluster.links().map((link, i) => (
              <LinkVertical<HierarchyPointLink<NodeShape>, HierarchyPointNode<NodeShape>>
                key={`cluster-link-${i}`}
                data={link}
                stroke={merlinsbeard}
                strokeWidth="1"
                strokeOpacity={0.2}
                fill="none"
              />
            ))}
            {cluster.descendants().map((node, i) => (
              <Node key={`cluster-node-${i}`} node={node} nodeSize={nodeSize}/>
            ))}
          </Group>
        )}
      </Cluster>
    )
  }
  return (
    <>
      <Zoom
        width={width}
        height={height}
        scaleXMin={1 / 3}
        scaleXMax={6}
        scaleYMin={1 / 3}
        scaleYMax={6}
        transformMatrix={initialTransform}
      >
        {zoom => {
          return (
            <div className="relative">
              <svg
                id={'svgChartZoom'}
                width={width}
                height={height}
                style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
              >
                <rect width={width} height={height} rx={14} fill={background} />
                <rect
                  width={chartWidth}
                  height={chartHeight}
                  rx={nodeSize}
                  fill="transparent"
                  onTouchStart={zoom.dragStart}
                  onTouchMove={zoom.dragMove}
                  onTouchEnd={zoom.dragEnd}
                  onMouseDown={zoom.dragStart}
                  onMouseMove={zoom.dragMove}
                  onMouseUp={zoom.dragEnd}
                  onMouseLeave={() => {
                    if (zoom.isDragging) zoom.dragEnd();
                  }}
                />
                <g transform={zoom.toString()}>
                  <Component />
                  <Cluster<NodeShape> root={data} size={[xMax, yMax]}>
                    {cluster => (
                      <Group top={margin.top} left={margin.left}>
                        {cluster.descendants().map((node, i) => (
                          <rect
                            key={`${node.data.name}`}
                            x={node.x - nodeSize}
                            y={node.y - nodeSize}
                            height={2*nodeSize}
                            width={2*nodeSize}
                            fillOpacity={0}
                            onMouseLeave={() => {
                              tooltipTimeout = window.setTimeout(() => {
                                hideTooltip();
                              }, 400);
                            }}
                            onClick={event => {
                              if (tooltipTimeout) clearTimeout(tooltipTimeout);
                              const eventSvgCoords = localPoint(event);
                              const name = node.data.name
                              const nodeData = {
                                name,
                                walletAddress: getItem(clusterData, 'walletAddress', name),
                                amount: getItem(clusterData, 'amount', name)
                              }
                              const svgPosition = document.getElementById('svgChartZoom')?.getBoundingClientRect()
                              showTooltip({
                                tooltipData: nodeData,
                                tooltipTop: eventSvgCoords && svgPosition ? eventSvgCoords.y + svgPosition.y : 0,
                                tooltipLeft: eventSvgCoords && svgPosition ? eventSvgCoords.x + svgPosition.x : 0,
                              });
                            }}
                          />
                        )
                        )}
                      </Group>
                    )}
                  </Cluster>
                </g>
              </svg>
              {tooltipOpen && tooltipData && (
                <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                  <div>
                    <Row><Col span={6}>Role</Col><Col span={18}>: {tooltipData.name}</Col></Row>
                    <Row><Col span={6}>Wallet Address</Col><Col span={18}>: {tooltipData.walletAddress}</Col></Row>
                    <Row><Col span={6}>Amount</Col><Col span={18}>: {tooltipData.amount}</Col></Row>
                  </div>
                </TooltipInPortal>
              )}
              <div className="controls">
                <button type="button" className="btn btn-lg" onClick={zoom.reset}>
                  Reset
                </button>
              </div>
            </div>
          )
        }}
      </Zoom>
    </>
  );
}
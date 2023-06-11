import * as React from 'react';
import styled from '@emotion/styled';
import { Layout } from '../MDUMiniView/types';

type Props = {
  layout: Layout;
  data: Map<string, string>;
};

const Container = styled.div`
  background-color: rgb(30,200,200, .3);
`;

export default function MDUScroller() {
  return <Container>sup</Container>;
}

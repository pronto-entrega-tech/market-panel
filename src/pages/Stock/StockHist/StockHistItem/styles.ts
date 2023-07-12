import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 270px;
  grid-template-rows: 24px 24px auto;
  padding: 8px 18px 8px 18px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
`;

export const Date = styled.div`
  grid-column: 1;
  grid-row: 1;
`;

export const Code = styled.div`
  grid-column: 1;
  grid-row: 1;
  justify-self: flex-end;
`;

export const Description = styled.div`
  grid-column: 1;
  grid-row: 2;
`;

export const Edit = styled.div`
  grid-column: 1;
  grid-row: 3;
`;

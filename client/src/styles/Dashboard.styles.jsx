import styled from 'styled-components';

export const DashBoardContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  background-color:#F4ECF7;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 10px;
  border-radius: 15px;
  font-size: 1.5rem;
  background-color:#0000;  
  &::placeholder {
    font-size: 1.5rem;
  }
`;

export const ResultsContainer = styled.div`
  flex-grow: 1;
  margin: 3rem 0;
  overflow-y: auto;
  overflow-x: auto;
  background-color:#BB8FCE;
`;

export const LyricsContainer = styled.div`
  height: 65vh;
  text-align: center;
  color: #fff;
  white-space: pre;
`;



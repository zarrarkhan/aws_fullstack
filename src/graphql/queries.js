/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getData = /* GraphQL */ `
  query GetData($id: ID!) {
    getData(id: $id) {
      id
      region
      scenario
      value
      createdAt
      updatedAt
    }
  }
`;
export const listData = /* GraphQL */ `
  query ListData(
    $filter: ModelDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        region
        scenario
        value
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

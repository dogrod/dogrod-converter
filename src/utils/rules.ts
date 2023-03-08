enum RuleType {
  'DOMAIN' = 'DOMAIN',
  'DOMAIN-SUFFIX' = 'DOMAIN-SUFFIX',
  'PROCESS-NAME' = 'PROCESS-NAME',
  'RULE-SET' = 'RULE-SET',
  'IP-CIDR' = 'IP-CIDR',
  'FINAL' = 'FINAL',
}

type FuncGenericReturn<T> = () => T

// Find last index function
const findLastIndex = function (
  arr: any[],
  callback: (value: any, i: number, array: any[]) => boolean,
): number {
  return (arr
    .map((val, i) => [i, val])
    .filter(([i, val]) => callback(val, i, arr))
    .pop() || [-1])[0]
}

export const insertDomainRule = (
  dataArr: string[],
  value: string,
  target = 'Nexitally',
  ruleType = RuleType.DOMAIN,
) => {
  const domainRule = `${ruleType},${value},${target}\r`

  // Find the index of line start with DOMAIN
  const lastDomainIndex = findLastIndex(dataArr, (line: string) =>
    line.startsWith(RuleType.DOMAIN),
  )

  console.log('lastDomainIndex', lastDomainIndex)

  // Insert element after the last index
  dataArr.splice(lastDomainIndex + 1, 0, domainRule)

  return dataArr
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { insertDomainRule } from '@/utils/rules'

type Data = {
  name: string
}

interface SurgeConfig {
  Host: Record<string, string>
  Rule: Record<string, boolean>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, headers } = req

  if (!query.url) {
    return res.status(400).send({ error: 'URL is required' })
  }

  const originConfigUrl = query.url as string

  const confHeader = `#!MANAGED-CONFIG https://${headers.host}${req.url} interval=43200\r`

  console.log('confHeader', confHeader)

  const { data } = await axios.get(originConfigUrl)

  // Parse data to array by line
  const dataArr = data.split('\n')

  // Insert domain rule after the last line start with DOMAIN,
  // Bing
  insertDomainRule(dataArr, 'bing.com')
  insertDomainRule(dataArr, 'www.bing.com')
  insertDomainRule(dataArr, 'cn.bing.com')
  insertDomainRule(dataArr, 'bing.net')

  console.log('dataArr', dataArr)

  // Replace first line by confHeader
  dataArr[0] = confHeader

  // Add line break at the end of line if not present
  dataArr.forEach((line: string, i: number) => {
    if (!line.endsWith('\r')) {
      dataArr[i] = `${line}\r`
    }
  })

  // If json present in request header, return json
  if (headers?.accept?.includes('application/json')) {
    res.status(200).json({ url: originConfigUrl, result: dataArr })
  } else {
    // else return plain text
    res
      .status(200)
      .setHeader(
        'content-disposition',
        'attachment;  filename=DogRod_Converter_Surge.conf',
      )
      .send(dataArr.join(''))
  }
}

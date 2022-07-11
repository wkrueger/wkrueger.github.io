import { useContext } from 'react'
import { articlesDetailContext } from './ArticlesDetail'

export default function ArticlesDetailContent() {
  const { articlesDetail } = useContext(articlesDetailContext)
  return <h1>{articlesDetail.slug}</h1>
}

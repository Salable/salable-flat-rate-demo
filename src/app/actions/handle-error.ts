export const handleError = async (response: Response, object: string) => {
  const headers = new Headers(response.headers)
  const headersMap = new Map(headers)
  const data = headersMap.get('content-type') !== 'text/plain' ? await response.json() : null
  let error = ''

  if (response.status === 404) {
    error = object + ' not found'
  }
  if (response.status !== 500 && data.error) {
    error = data.error
  }
  console.error(error)
  return {error: error ?? 'Unknown Error'}
}
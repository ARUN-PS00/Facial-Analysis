import { LOCAL_MEME_MANIFEST } from './memeManifest'

export class LocalMemeProvider {
  getByCategory(category) {
    const matches = LOCAL_MEME_MANIFEST.filter((m) => m.category === category)
    if (matches.length > 0) {
      const idx = Math.floor(Math.random() * matches.length)
      return matches[idx]
    }
    // Fallback to random local asset if category match not found
    const fallbackIdx = Math.floor(Math.random() * LOCAL_MEME_MANIFEST.length)
    return LOCAL_MEME_MANIFEST[fallbackIdx]
  }

  getById(id) {
    return LOCAL_MEME_MANIFEST.find((m) => m.id === id) || LOCAL_MEME_MANIFEST[0]
  }
}

export class OnlineMemeProvider {
  async getByCategory(category) {
    try {
      // Free open public Meme API (no auth required)
      const res = await fetch(`https://meme-api.com/gimme/${category}`, {
        signal: AbortSignal.timeout(3000), // 3s fast timeout
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (data && data.url) {
        return {
          id: 'online_' + (data.postLink || Date.now()),
          category,
          path: data.url,
          title: data.title || `${category} meme`,
          type: data.url.endsWith('.gif') ? 'gif' : 'image',
          isOnline: true,
        }
      }
      throw new Error('Invalid online meme response structure')
    } catch (err) {
      console.warn('Online Meme Provider unavailable, falling back to local library:', err)
      return null
    }
  }
}

export class MemeProviderManager {
  constructor() {
    this.local = new LocalMemeProvider()
    this.online = new OnlineMemeProvider()
  }

  async getMemeForCategory(category, allowOnline = true) {
    if (allowOnline) {
      const onlineMeme = await this.online.getByCategory(category)
      if (onlineMeme) return onlineMeme
    }
    return this.local.getByCategory(category)
  }
}

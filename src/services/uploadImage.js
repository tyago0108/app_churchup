import { supabase } from './supabaseClient'

export async function uploadImagem(file) {
  if (!file) return null

  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('eventos')
    .upload(fileName, file)

  if (error) {
    console.log('Erro upload:', error)
    return null
  }

  // 🔥 URL MANUAL (100% confiável)
  const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/eventos/${fileName}`

  return url
}
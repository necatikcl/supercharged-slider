import { Slider } from '~/utils/createSlider'

type Middleware = {
  name: string
  callback: (slider: Slider) => void
}

export type { Middleware }

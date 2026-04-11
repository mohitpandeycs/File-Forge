export interface Step {
  id: number
  title: string
  description: string
  icon: string
}

export const steps: Step[] = [
  {
    id: 1,
    title: 'Drop Your File',
    description: 'Drag and drop or click to upload. We auto-detect the format instantly.',
    icon: 'upload',
  },
  {
    id: 2,
    title: 'Pick a Format',
    description: 'Choose your target format from the compatible options that appear.',
    icon: 'arrow-right-left',
  },
  {
    id: 3,
    title: 'Download Result',
    description: 'Your converted file is ready. One click to download — done.',
    icon: 'download',
  },
]

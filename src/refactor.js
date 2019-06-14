/** @format */

'use strict'

import {data} from './data'

const calcPercent = (amount, total) => {
  return parseFloat((Number(amount) / Number(total)) * 100).toFixed(2)
}

//creates the summary for each comarca
const createSummaryComarca = comarca => {
  let comarcaTotal = comarca['cross:DataSet']['cross:Section']['cross:Obs'][2].OBS_VALUE
  let mp = calcPercent(comarca['cross:DataSet']['cross:Section']['cross:Obs'][0].OBS_VALUE, comarcaTotal)
  let fp = calcPercent(comarca['cross:DataSet']['cross:Section']['cross:Obs'][1].OBS_VALUE, comarcaTotal)
  let summaryComarca = {
    name: comarca.title,
    malePercent: mp,
    femalePercent: fp,
  }

  return summaryComarca
}

//creates stats for the whole dataset, takes the dataset as first arg and the entry array as second arg
const createStats = (data, entry) => {
  let stats = {}

  stats.numeroComarcasMasHombres = entry.filter(comarca => comarca.malePercent > comarca.femalePercent).length
  stats.numeroComarcasMasMujeres = entry.filter(comarca => comarca.malePercent < comarca.femalePercent).length
  stats.numeroComarcasTotal = entry.length
  stats.numeroTotalHabitantesHombres = data.entry
    .map(x => Number(x['cross:DataSet']['cross:Section']['cross:Obs'][0].OBS_VALUE))
    .reduce((a, b) => a + b)
  stats.numeroTotalHabitantesMujeres = data.entry
    .map(x => Number(x['cross:DataSet']['cross:Section']['cross:Obs'][1].OBS_VALUE))
    .reduce((a, b) => a + b)
  stats.numeroTotalHabitantes = stats.numeroTotalHabitantesHombres + stats.numeroTotalHabitantesMujeres

  return stats
}

//main function that calls the others
const createGlobalSummary = (data => {
  let summary = {}

  summary.entry = data.entry.map(comarca => createSummaryComarca(comarca))
  summary.stats = createStats(data, summary.entry)

  console.log(summary)
  return summary
})(data)

let coverage = 0
let cost = 0

export function  calculateProductPrice(product, employee, selectedOptions){
  let price = 0
  const familyToCover = selectedOptions.familyMembersToCover

  if (product.type != 'medical' && product.type != 'volLife' && product.type != 'ltd') {
    throw new Error(`Unknown product type: ${product.type}`)
  } 

  price += medicalPricing(product, familyToCover)
  price += voluntaryPricing(product, familyToCover, selectedOptions)
  price += disabilityPricing(product, familyToCover, employee)

  return parseInt(price * 100) / 100
}

function medicalPricing(product, familyToCover){
  let medicalPrice = 0

  if (product.type != 'medical') { return 0 }
  for(var x in familyToCover){
    let familyMember = familyToCover[x]
    
    medicalPrice += product.costs.find(cost => {
      return cost.role === familyMember
    }).price
  }
  return medicalPrice
}

function voluntaryPricing(product, familyToCover, selectedOptions){
  if (product.type != 'volLife') { return 0 }
  let voluntaryPricing = 0
  for(var x in familyToCover){
    let familyMember = familyToCover[x]
    console.log(familyMember)

    coverage = selectedOptions.coverageLevel.find(coverage => {
      return coverage.role === familyMember
    }).coverage

    cost = product.costs.find(cost => {
      return cost.role === familyMember
    })

    voluntaryPricing += (coverage / cost.costDivisor) * cost.price
  }

  return employerContribution(product, voluntaryPricing)
}

function disabilityPricing(product, familyToCover, employee){
  if (product.type != 'ltd') { return 0 }
  let disabilityPrice = 0
  for(var x in familyToCover){
    let familyMember = familyToCover[x]
    coverage = product.coverage.find(coverage => {
      return coverage.role === familyMember
    })
    cost = product.costs.find(cost => {
      return cost.role === familyMember
    })

    const salaryPercentage = coverage.percentage / 100
    disabilityPrice += ((employee.salary * salaryPercentage) / cost.costDivisor) * cost.price
  }
  
  disabilityPrice = (disabilityPrice * 100) / 100
  return employerContribution(product, disabilityPrice)
}


function employerContribution(product, pricing){
  if(product.employerContribution.mode === 'dollar'){
    return pricing - product.employerContribution.contribution
  } else { 
    const dollarsOff = pricing * (product.employerContribution.contribution /100)
    return pricing - dollarsOff
  }
}
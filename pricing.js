function medicalPricing(costs, familyToCover){
  let medicalPrice = 0

  familyToCover.forEach( (familyMember) => {
    medicalPrice += costs.find(cost => {
      return cost.role === familyMember
    }).price
  })

  return medicalPrice
}

function voluntaryPricing(productCosts, familyToCover, selectedOptions){

  let voluntaryPricing = 0
  let coverage = 0
  let cost = 0

  familyToCover.forEach( (familyMember) => {
    coverage = selectedOptions.coverageLevel.find(coverage => {
      return coverage.role === familyMember
    }).coverage

    cost = productCosts.find(cost => {
      return cost.role === familyMember
    })

    voluntaryPricing += (coverage / cost.costDivisor) * cost.price
  })
  
  return  voluntaryPricing
}

function disabilityPricing(productCosts, productCoverage, familyToCover, employee){

  let disabilityPrice = 0
  let coverage = 0
  let cost = 0

  familyToCover.forEach( (familyMember) => {
    coverage = productCoverage.find(coverage => {
      return coverage.role === familyMember
    })
    cost = productCosts.find(cost => {
      return cost.role === familyMember
    })

    const salaryPercentage = coverage.percentage / 100
    disabilityPrice += ((employee.salary * salaryPercentage) / cost.costDivisor) * cost.price
  })
  
  disabilityPrice = (disabilityPrice * 100) / 100
  return disabilityPrice
}


function employerContribution(employerContribution, pricing){
  if(employerContribution.mode === 'dollar'){
    return pricing - employerContribution.contribution
  } else { 
    const dollarsOff = pricing * (employerContribution.contribution /100)
    return pricing - dollarsOff
  }
}

export function  calculateProductPrice(product, employee, selectedOptions){
  let price = 0
  const familyToCover = selectedOptions.familyMembersToCover

  switch (product.type) {
    case ('medical'):
      price += medicalPricing(product.costs, familyToCover)
      break
    case ('volLife'):
      price += employerContribution(product.employerContribution, voluntaryPricing(product.costs, familyToCover, selectedOptions))
      break
    case ('ltd'):
      price += employerContribution(product.employerContribution, disabilityPricing(product.costs, product.coverage, familyToCover, employee))
      break
    default:
      throw new Error(`Unknown product type: ${product.type}`)
  }

  return parseInt(price * 100) / 100
}
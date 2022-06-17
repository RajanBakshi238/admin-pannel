export const transTypes ={
    1: 'Admission Fee',
    2: 'Monthly Fee',
    3: 'Pending Fee',
    4: 'Fine'
}

export const formatAmount = (amount) => {
    let numberFormat = new Intl.NumberFormat('en-US')
    return numberFormat.format(amount)
}
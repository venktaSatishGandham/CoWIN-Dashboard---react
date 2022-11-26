import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachDayData => ({
            vaccineDate: eachDayData.vaccine_date,
            dose1: eachDayData.dose_1,
            dose2: eachDayData.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          genderType => ({
            gender: genderType.gender,
            count: genderType.count,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderVaccinationStats = () => {
    const {vaccinationData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loading-view">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderViewsBasedOnAPIStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard

/* Write your code here
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import VaccinationCoverage from '../VaccinationCoverage/index'
import VaccinationByGender from '../VaccinationByGender/index'
import VaccinationByAge from '../VaccinationByAge/index'

import './index.css'

const apiDataConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {
    VaccinationCov: [],
    vaccinationByGender: [],
    vaccinationByAge: [],
    isLoading: apiDataConstants.initial,
  }

  componentDidMount() {
    this.getDataFromCovidApi()
  }

  getDataFromCovidApi = async () => {
    this.setState({isLoading: apiDataConstants.loading})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok) {
      const data = await response.json()
      const updatedVacCov = data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const updatedVacGender = data.vaccination_by_gender
      const updatedVacAge = data.vaccination_by_age
      this.setState({
        isLoading: apiDataConstants.success,
        VaccinationCov: updatedVacCov,
        vaccinationByGender: updatedVacGender,
        vaccinationByAge: updatedVacAge,
      })
    } else if (response.ok === false) {
      this.setState({isLoading: apiDataConstants.failure})
    }
  }

  renderIsLoading = () => {
    console.log('loader')
    return (
      <div>
        <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
      </div>
    )
  }

  renderSuccess = () => {
    const {VaccinationCov, vaccinationByGender, vaccinationByAge} = this.state
    return (
      <div>
        <VaccinationCoverage coverageDetails={VaccinationCov} />
        <div className="margin">
          <VaccinationByGender genderDetails={vaccinationByGender} />
        </div>
        <VaccinationByAge ageDetails={vaccinationByAge} />
      </div>
    )
  }

  renderFailure = () => {
    console.log('failure')
    return (
      <div>
        <img
          alt="failure view"
          className="failure"
          src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        />
        <h1>Something went wrong</h1>
      </div>
    )
  }

  isChecking = () => {
    const {isLoading} = this.state
    switch (isLoading) {
      case apiDataConstants.success:
        return this.renderSuccess()
      case apiDataConstants.failure:
        return this.renderFailure()
      case apiDataConstants.loading:
        return this.renderIsLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="covid-container">
        <div className="logo-container">
          <img
            alt="website logo"
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <h1 className="logo-text">Co-WIN</h1>
        </div>
        <p className="logo-title">CoWIN Vaccination in India</p>
        {this.isChecking()}
      </div>
    )
  }
}

export default CowinDashboard
*/

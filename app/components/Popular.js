import React from 'react';
import PropTypes from 'prop-types';
import { fecthPopularRepos } from '../utils/api';
import Loading from './Loading';


function SelectLanguage({ selectedLanguage, onSelect }) {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python', 'Elixir'];
  return (
    <ul className='languages'>
      {languages.map((language) => (
        <li
          style={language === selectedLanguage ? { color: '#d0021b' } : null}
          onClick={() => onSelect(language)}
          key={language}>
          {language}
        </li>
      ))}
    </ul>
  )
}

function RepoGrid({ repos }) {
  return (
    <ul className='popular-list'>
      {repos.map(({ name, owner, stargazers_count, html_url }, index) => (
        <li key={name} className='popular-item'>
          <div className='popular-rank'>#{index + 1}</div>
          <ul className='space-list-items'>
            <li>
              <img
                src={owner.avatar_url}
                alt={'Avatar for ' + owner.login}
                className='avatar' />
            </li>
            <li>
              <a href={html_url}>{name}</a>
            </li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}
RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }
  updateLanguage(language) {
    this.setState(() => ({
      selectedLanguage: language,
      repos: null
    }));

    fecthPopularRepos(language)
      .then((repos) => this.setState(() => ({ repos })));
  }
  render() {
    const {selectedLanguage, repos} = this.state
    return (
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage}
        />

        {!repos
          ? <Loading text='Fetching' speed={10} />
          : <RepoGrid repos={repos} />
        }
      </div>
    )
  }
}

export default Popular;
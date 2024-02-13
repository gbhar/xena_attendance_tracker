import React from 'react'
import {mount, shallow} from 'enzyme'
import {ImageSelection} from './ImageSelection.component'
import {Grid} from '@material-ui/core'

describe('ImageSelection component', () => {
  let wrapper
  const props = {
    updateState: jest.fn(),
    state: {
      processing: false,
      newFile: false,
      hoverState: false,
    },
  }

  beforeEach(() => {
    props.updateState.mockClear()
    URL.createObjectURL = jest.fn().mockImplementationOnce(file => {
      return file.name
    })
    URL.revokeObjectURL = jest.fn()
    wrapper = shallow(<ImageSelection {...props} />)
  })

  it('should render component', () => {
    expect(wrapper.length).toEqual(1)
  })

  it('should create object url if file exists', () => {
    const localProps = {
      ...props,
      state: {
        ...props.state,
        file: {
          name: 'test.jpg',
        },
      },
    }
    wrapper = mount(<ImageSelection {...localProps} />)
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
  })

  describe('FILE', () => {
    const localProps = {
      ...props,
      state: {
        ...props.state,
        file: {
          name: 'test.jpg',
        },
      },
    }
    beforeEach(() => {
      wrapper = mount(<ImageSelection {...localProps} />)
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('should render image', () => {
      expect(wrapper.find('img').length).toEqual(1)
    })

    describe('Image Classes', () => {
      it('should have the right default image classes', () => {
        expect(
          wrapper.find('img').props().className.includes('makeStyles-img'),
        ).toBe(true)
        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imageFade'),
        ).toBe(false)
        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imagePointer'),
        ).toBe(false)
      })

      it('should have have the right classes for hover', () => {
        wrapper.setProps({
          ...localProps,
          state: {
            ...localProps.state,
            hoverState: true,
          },
        })

        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imageFade'),
        ).toBe(true)
        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imagePointer'),
        ).toBe(true)
      })

      it('should have the right classes for processing', () => {
        wrapper.setProps({
          ...localProps,
          state: {
            ...localProps.state,
            processing: true,
          },
        })

        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imageFade'),
        ).toBe(true)
        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imagePointer'),
        ).toBe(false)
      })

      it('should have the right classes for processing and hovering', () => {
        wrapper.setProps({
          ...localProps,
          state: {
            ...localProps.state,
            hoverState: true,
            processing: true,
          },
        })

        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imageFade'),
        ).toBe(true)
        expect(
          wrapper
            .find('img')
            .props()
            .className.includes('makeStyles-imagePointer'),
        ).toBe(false)
      })
    })

    it('should call on click', () => {
      const click = jest.fn()
      const getElementSpy = jest.spyOn(document, 'getElementById')
      getElementSpy.mockImplementation(() => ({click}))
      wrapper.find('img').props().onClick()
      expect(click).toHaveBeenCalledTimes(1)
    })

    it('should call update state on mouse enter and leave', () => {
      wrapper.find('img').props().onMouseEnter()
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toEqual({
        ...localProps.state,
        hoverState: true,
      })

      wrapper.find('img').props().onMouseLeave()
      expect(props.updateState).toHaveBeenCalledTimes(2)
      expect(props.updateState.mock.calls[1][0]).toEqual({
        ...localProps.state,
        hoverState: false,
      })
    })

    it('should render button if new file', () => {
      wrapper.setProps({
        ...localProps,
        state: {
          ...localProps.state,
          newFile: true,
        },
      })
      expect(wrapper.find('button').length).toEqual(1)
    })

    it('should call update state when button clicked', () => {
      wrapper.setProps({
        ...localProps,
        state: {
          ...localProps.state,
          newFile: true,
        },
      })
      wrapper.find('button').props().onClick()
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toEqual({
        ...localProps.state,
        processing: true,
        newFile: true,
      })
    })

    it('should be disabled when processing', () => {
      wrapper.setProps({
        ...localProps,
        state: {
          ...localProps.state,
          newFile: true,
          processing: true,
        },
      })
      expect(wrapper.find('button').props().disabled).toEqual(true)
    })

    it('should render correct text based on processing value', () => {
      wrapper.setProps({
        ...localProps,
        state: {
          ...localProps.state,
          newFile: true,
        },
      })
      expect(wrapper.find('button').text()).toEqual('Process Image')
      wrapper.setProps({
        ...localProps,
        state: {
          ...localProps.state,
          newFile: true,
          processing: true,
        },
      })
      expect(wrapper.find('button').text()).toEqual('Processing Image...')
    })
  })

  describe('NO FILE', () => {
    it('should render upload id section', () => {
      expect(
        wrapper.find(Grid).at(2).props().className.includes('imageSelection'),
      ).toEqual(true)
    })

    it('should have the right class for hover state', () => {
      expect(
        wrapper.find(Grid).at(2).props().className.includes('hover'),
      ).toEqual(false)
      wrapper.setProps({
        ...props,
        state: {
          ...props.state,
          hoverState: true,
        },
      })
      expect(
        wrapper.find(Grid).at(2).props().className.includes('hover'),
      ).toEqual(true)
    })

    it('should call onclick', () => {
      const click = jest.fn()
      const getElementSpy = jest.spyOn(document, 'getElementById')
      getElementSpy.mockImplementation(() => ({click}))
      wrapper.find(Grid).at(2).props().onClick()
      expect(click).toHaveBeenCalledTimes(1)
    })

    it('should call update state on mouse enter and leave', () => {
      wrapper.find(Grid).at(2).props().onMouseEnter()
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toEqual({
        ...props.state,
        hoverState: true,
      })

      wrapper.find(Grid).at(2).props().onMouseLeave()
      expect(props.updateState).toHaveBeenCalledTimes(2)
      expect(props.updateState.mock.calls[1][0]).toEqual({
        ...props.state,
        hoverState: false,
      })
    })
  })

  it('should call on change when file is uploaded', () => {
    wrapper
      .find('input')
      .props()
      .onChange({
        target: {
          files: [{name: 'test.jpg'}],
        },
      })

    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      ...props.state,
      file: {name: 'test.jpg'},
      newFile: true,
      noUserError: false,
      newUser: false,
    })
  })
})
